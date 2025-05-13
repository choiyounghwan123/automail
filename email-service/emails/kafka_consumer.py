from kafka import KafkaConsumer
import json
import logging
import time

from emails.tasks import send_notification_email

logger = logging.getLogger(__name__)

def start_kafka_consumer():
    while True:  # 재연결을 위한 무한 루프
        try:
            logger.info("Starting Kafka consumer for 'email-notifications' and 'email-verification-tokens' topics...")
            consumer = KafkaConsumer(
                'email-notifications',
                'email-verification-tokens',
                bootstrap_servers=['kafka:9092'],
                group_id='email-service-group',
                auto_offset_reset='earliest',
                enable_auto_commit=True,
                session_timeout_ms=60000,  # 세션 타임아웃을 60초로 설정
                heartbeat_interval_ms=20000,  # 하트비트 간격을 20초로 설정
                max_poll_interval_ms=300000,  # 최대 폴링 간격을 5분으로 설정
            )
            
            logger.info("Kafka consumer initialized and waiting for messages...")
            
            for message in consumer:
                try:
                    logger.info("Received message from topic %s: %s", message.topic, message.value)
                    # message.value가 dict면 그대로, bytes/str면 json.loads로 파싱
                    if isinstance(message.value, dict):
                        data = message.value
                    elif isinstance(message.value, bytes):
                        data = json.loads(message.value.decode('utf-8'))
                    elif isinstance(message.value, str):
                        data = json.loads(message.value)
                    else:
                        raise TypeError(f'Unsupported message.value type: {type(message.value)}')

                    if message.topic == 'email-notifications':
                        # 함수를 직접 호출 (RabbitMQ 사용하지 않음)
                        send_notification_email(data)
                        logger.info("Called send_notification_email directly (data: %s)", data)
                    elif message.topic == 'email-verification-tokens':
                        # 토큰 정보 로깅
                        logger.info("Received verification token: %s", data)
                    
                except Exception as e:
                    logger.error("Error processing message: %s", e, exc_info=True)
                    
        except Exception as e:
            logger.error(f"Error in Kafka consumer: {e}", exc_info=True)
            logger.info("Retrying connection in 5 seconds...")
            time.sleep(5)  # 재연결 전 대기