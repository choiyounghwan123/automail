from django.core.management.base import BaseCommand
from emails.kafka_consumer import start_kafka_consumer

class Command(BaseCommand):
    help = 'Start Kafka consumer for notices topic'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Kafka consumer...'))
        start_kafka_consumer()