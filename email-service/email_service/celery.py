from celery import Celery
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "email_service.settings")

app = Celery('email_service')

app.conf.task_queues = {
    'email_verification_queue': {
        'exchange': 'emailExchange',
        'routing_key': 'email.key',
    }
}

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(['emails'])

