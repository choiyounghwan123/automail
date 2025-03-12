from datetime import timedelta

from django.db import models
import uuid
from django.utils import timezone

def default_expiration_time():
    return timezone.now() + timedelta(hours=24)

class EmailVerification(models.Model):
    email = models.EmailField(unique=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiration_time)

    def is_expired(self):
        return timezone.now() > self.expires_at

    class Meta:
        db_table = 'email_verification'