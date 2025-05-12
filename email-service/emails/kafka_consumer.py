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
                auto_offset_reset='earliest',  # 가장 오래된 메시지부터 처리
                enable_auto_commit=False,  # 수동 커밋으로 변경
                group_id='email-service-group',
                value_deserializer=lambda x: x.decode('utf-8'),
                consumer_timeout_ms=30000,  # 타임아웃을 30초로 증가
                max_poll_interval_ms=600000  # 폴링 간격을 10분으로 증가
            )
            logger.info("Kafka consumer initialized, waiting for messages...")
            
            for message in consumer:
                try:
                    logger.info("Received message from topic %s: %s", message.topic, message.value)
                    data = json.loads(message.value)
                    logger.info("Parsed data: %s", data)

                    if message.topic == 'email-notifications':
                        # Celery 태스크 실행
                        send_notification_email.delay(data)  # 비동기 실행으로 변경
                        logger.info("Sent data to Celery task: %s", data)
                    elif message.topic == 'email-verification-tokens':
                        # 토큰 정보 로깅
                        logger.info("Received verification token: %s", data)
                    
                    # 메시지 처리 완료 후 커밋
                    consumer.commit()
                    logger.info("Message committed successfully")
                    
                except json.JSONDecodeError as e:
                    logger.error("Failed to parse message: %s, error: %s", message.value, e)
                except Exception as e:
                    logger.error("Error processing message: %s", e, exc_info=True)
                    
        except Exception as e:
            logger.error(f"Error in Kafka consumer: {e}", exc_info=True)
            logger.info("Retrying connection in 5 seconds...")
            time.sleep(5)  # 재연결 전 대기