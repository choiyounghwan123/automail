# tasks.py - 이메일 인증 관련 Celery 태스크
from celery import shared_task
from emails.models import EmailVerification
from django.core.mail import EmailMessage, send_mail
from django.conf import settings
import uuid
from datetime import timedelta
from django.utils import timezone
from kafka import KafkaProducer
import json

def default_expiration_time():
    return timezone.now() + timedelta(hours=24)

@shared_task(queue='email_verification_queue')
def send_verification_email(email):
    # 기존 토큰이 있다면 삭제
    EmailVerification.objects.filter(email=email).delete()
    
    # 새 토큰 생성
    token = EmailVerification.objects.create(
        email=email,
        expires_at=default_expiration_time()
    )
    
    # Kafka로 토큰 전송
    producer = KafkaProducer(
        bootstrap_servers=['kafka:9092'],
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    
    # 토큰 정보를 Kafka로 전송
    token_data = {
        'email': email,
        'token': str(token.uuid),
        'expires_at': token.expires_at.isoformat()
    }
    producer.send('email-verification-tokens', value=token_data)
    producer.flush()
    
    # 이메일 발송
    verification_link = f"http://localhost:8003/api/email/verify?token={token.uuid}"
    send_mail(
        '이메일 인증',
        f'이메일 인증을 위해 다음 링크를 클릭하세요: {verification_link}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )

from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings

@shared_task
def send_notification_email(data):
    """
    Kafka에서 받은 데이터를 기반으로 이메일을 보내는 Celery 태스크.

    Parameters:
        data (dict): {
            "title": str,
            "content": str,
            "recipients": list,
            "link": str (optional),
            "images": list (optional) - 이미지 URL 또는 base64 인코딩된 이미지 데이터
        }
    """
    try:
        # 데이터 유효성 검사
        title = data.get("title")
        content = data.get("content", "")
        recipients = data.get("recipients", [])
        link = data.get("link", "")
        images = data.get("images", [])  # 이미지 리스트로 변경

        if not title or not recipients:
            print(f"Invalid data: {data}. 'title' and 'recipients' are required.")
            return

        # 이미지 HTML 생성
        images_html = ""
        if images and isinstance(images, list) and len(images) > 0:
            images_html = "<div class='images'>"
            for idx, img in enumerate(images):
                if not img:  # 이미지가 None이거나 빈 문자열인 경우 건너뛰기
                    continue
                if isinstance(img, str):
                    if img.startswith('data:image'):  # base64 이미지
                        print(f"Processing base64 image {idx + 1}/{len(images)}")
                        images_html += f"<img src='{img}' style='max-width: 100%; margin: 10px 0;'/>"
                    else:  # URL 이미지
                        print(f"Processing URL image {idx + 1}/{len(images)}: {img}")
                        images_html += f"<img src='{img}' style='max-width: 100%; margin: 10px 0;'/>"
            images_html += "</div>"
            print("Images HTML generated successfully")

        # 이메일 내용 구성 (HTML)
        html_content = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>{title}</title>
            <style>
                .container {{ font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; }}
                .header {{ font-size: 24px; font-weight: bold; color: #333; }}
                .content {{ font-size: 16px; margin: 20px 0; }}
                .link {{ color: #4CAF50; text-decoration: none; }}
                .images {{ margin: 20px 0; }}
                .images img {{ border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">{title}</div>
                <div class="content">{content}</div>
                {images_html}
                {"<div><a href='" + link + "' class='link'>자세히 보기</a></div>" if link else ""}
            </div>
        </body>
        </html>
        """

        # 이메일 발송
        email_message = EmailMessage(
            subject=title,
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
        )
        email_message.content_subtype = "html"
        email_message.send()
        print(f"Notification email sent to {recipients} with title: {title} and {len(images)} images")
    except Exception as e:
        print(f"Failed to send notification email: {e}")
        print(f"Error details: {str(e)}")  # 더 자세한 에러 정보 출력