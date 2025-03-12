from rest_framework import serializers
from .models import EmailVerification

class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerification
        fields = ["email", "uuid","is_verified","created_at","expires_at"]
