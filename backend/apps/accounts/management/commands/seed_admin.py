from django.core.management.base import BaseCommand
from decouple import config
from apps.accounts.models.user import User


class Command(BaseCommand):
    help = "Idempotently seeds a default administrator account into the database."

    def handle(self, *args, **options):
        admin_email = config("ADMIN_EMAIL", default="himanshucodes.ai@gmail.com")
        admin_password = config("ADMIN_PASSWORD", default="himanshu.builds")
        first_name = config("ADMIN_FIRST_NAME", default="Himanshu")
        last_name = config("ADMIN_LAST_NAME", default="Kumar")

        user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            },
        )

        if created:
            user.set_password(admin_password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Successfully created initial Admin account: {admin_email}")
            )
        else:
            # Ensure permissions and role are set correctly if account already existed
            updated = False
            if user.role != User.Role.ADMIN:
                user.role = User.Role.ADMIN
                updated = True
            if not user.is_staff:
                user.is_staff = True
                updated = True
            if not user.is_superuser:
                user.is_superuser = True
                updated = True
            if not user.is_verified:
                user.is_verified = True
                updated = True

            if updated:
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f"Updated permissions for existing Admin user: {admin_email}")
                )
            else:
                self.stdout.write(
                    self.style.NOTICE(f"Admin user already exists and is active: {admin_email}")
                )
