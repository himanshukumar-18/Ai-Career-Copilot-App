from django.core.mail import send_mail
from django.conf import settings


def send_otp_email(email, otp):

    send_mail(
        subject="Verify Your Account",
        message=f"""
Your verification code is:

{otp}

This OTP will expire in 10 minutes.
""",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )