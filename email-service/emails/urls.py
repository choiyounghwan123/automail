from django.urls import path
from emails.views import VerifyEmailView

urlpatterns = [
    path('verify', VerifyEmailView.as_view(), name="verify-email")
]