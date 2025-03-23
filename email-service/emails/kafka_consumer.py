from kafka import KafkaConsumer
import json
import logging

from emails.tasks import send_notification_email

logger = logging.getLogger(__name__)

def start_kafka_consumer():
    try:
        logger.info("Starting Kafka consumer for 'email-notifications' topic...")
        consumer = KafkaConsumer(
            'email-notifications',
            bootstrap_servers=['kafka:9092'],
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            group_id='email-service-group',
            value_deserializer=lambda x: x.decode('utf-8')
        )
        logger.info("Kafka consumer initialized, waiting for messages...")
        for message in consumer:
            logger.info("Received message: %s", message.value)

            try:
                data = json.loads(message.value)
                logger.info("Parsed data: %s", data)

                send_notification_email(data)
                logger.info("Sent data to Celery task: %s", data)
            except json.JSONDecodeError as e:
                logger.error("Failed to parse message: %s, error: %s", message.value,e)
            except Exception as e:
                logger.error("Error processing message: %s", e)
    except Exception as e:
        logger.error(f"Error in Kafka consumer: {e}", exc_info=True)