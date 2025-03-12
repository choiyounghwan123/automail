# tasks.py - 이메일 인증 관련 Celery 태스크
from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage
from emails.models import EmailVerification


@shared_task
def send_verification_email(data):
    """
    이메일 인증 요청을 처리하는 Celery 태스크.

    Parameters:
        data (dict or str): 인증 이메일을 전송할 데이터를 포함.
            - dict: {"email": "example@example.com"}
            - str: "example@example.com" (자동 변환됨)

    Returns:
        None
    """

    # 1. 데이터 타입 확인 및 변환
    if isinstance(data, str):
        data = {"email": data}

    if not isinstance(data, dict):
        print(f"Invalid data type: {type(data)}. Expected dict.")
        return

    # 2. 이메일 주소 추출 및 유효성 검사
    email = data.get("email")
    if not email:
        print("Email not found in data.")
        return

    # 3. 이메일 인증 토큰 생성
    try:
        token = EmailVerification.objects.create(email=email)
        verification_link = f"{settings.SITE_URL}/api/email/verify?token={token.uuid}"
    except Exception as e:
        print(f"Failed to create EmailVerification object: {e}")
        return

    # 4. HTML 이메일 내용 구성
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>이메일 인증</title>
        <style>
            .container {{
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #f9f9f9;
            }}
            .header {{
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #4CAF50;
            }}
            .content {{
                font-size: 16px;
                margin-bottom: 20px;
            }}
            .button {{
                text-align: center;
                margin-top: 20px;
            }}
            .button a {{
                text-decoration: none;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                display: inline-block;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
    <div class="container">
        <div class="header">이메일 인증 요청</div>
        <div class="content">
            안녕하세요,<br>
            이메일 인증을 완료하시려면 아래 버튼을 클릭해주세요.
        </div>
        <div class="button">
            <a href="{verification_link}" target="_blank">이메일 인증하기</a>
        </div>
        <div class="footer">
            이 링크는 24시간 동안만 유효합니다.<br>
            문제가 발생한 경우, 관리자에게 문의해주세요.
        </div>
    </div>
    </body>
    </html>
    """

    # 5. 이메일 발송
    try:
        email_message = EmailMessage(
            subject="이메일 인증 요청",
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        email_message.content_subtype = "html"  # HTML 형식으로 설정
        email_message.send()
        print(f"Verification email sent to {email}.")
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")