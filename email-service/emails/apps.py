import threading
from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class EmailsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'emails'
    verbose_name = "Email Service wiht Kafka"

    def ready(self):
        logger.info("EmailsConfig.ready() called, starting Kafka consumer...")
        from .kafka_consumer import start_kafka_consumer
        thread = threading.Thread(target=start_kafka_consumer, daemon=True)
        thread.start()

