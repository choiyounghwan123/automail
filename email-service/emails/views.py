from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from emails.models import EmailVerification
from .producer import send_completion_message

class VerifyEmailView(APIView):
    def get(self, request):
        token = request.GET.get('token')
        if not token:
            return Response({"error": "토큰이 제공되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            email_token = EmailVerification.objects.get(uuid=token)
            if email_token.is_expired():
                return Response({"error": "토큰이 만료되었습니다."}, status=status.HTTP_400_BAD_REQUEST)

            email_token.delete()
            send_completion_message(email_token.email)
            return Response({"message": "이메일 인증 성공!"}, status=status.HTTP_200_OK)
        except EmailVerification.DoesNotExist:
            return Response({"error":"유효하지 않은 토큰입니다."},status=status.HTTP_400_BAD_REQUEST)