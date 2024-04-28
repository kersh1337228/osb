import datetime
import unicodedata
from typing import Self
import django.db.models
from django.core import validators
from django.db import models
from django.conf import settings
from django.contrib.auth import password_validation
from django.utils.crypto import salted_hmac
from django.contrib.auth.hashers import (
    acheck_password,
    check_password,
    is_password_usable,
    make_password
)

from src.apps.post.models import Post


class UserManager(models.Manager):
    @classmethod
    def normalize_email(
            cls: Self,
            email: str
    ):
        email = email or ''
        try:
            email_name, domain_part = email.strip().rsplit('@', 1)
        except ValueError:
            pass
        else:
            email = email_name + '@' + domain_part.lower()
        return email

    def get_by_natural_key(
            self: Self,
            username: str
    ):
        return self.get(**{self.model.USERNAME_FIELD: username})

    def create_user(
            self: Self,
            username: str,
            email: str,
            password: str,
            **kwargs
    ):
        email = UserManager.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    async def acreate_user(
            self: Self,
            username: str,
            email: str,
            password: str,
            **kwargs
    ):
        email = UserManager.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **kwargs
        )
        user.set_password(password)
        await user.asave(using=self._db)
        return user

    def create_superuser(
            self: Self,
            username: str,
            email: str,
            password: str,
            **kwargs
    ):
        kwargs['is_superuser'] = True
        user = self.create_user(
            username, email, password,
            **kwargs
        )
        return user


# Function to create path for user profile pictures
def upload_to_profile_picture(
        instance: models.Model,
        filename: str
) -> str:
    now = datetime.datetime.now().strftime('%Y/%m/%d')
    return f'{instance.id}/images/profile_pictures/{now}/{filename}'


class User(models.Model):
    objects = UserManager()

    # User authentication data
    username = models.CharField(
        verbose_name='Username',
        max_length=255,
        null=False,
        blank=False,
        unique=True,
        validators=(
            validators.RegexValidator(
                regex=r'^[a-z]{1}[a-z0-9_]+$',
                message='Username must satisfy: "^[a-z]{1}[a-z0-9_]+$"',
                code='invalid_registration'
            ),
        )
    )
    password = models.CharField(
        verbose_name='Password',
        max_length=127,
        null=False,
        blank=False,
        unique=False
    )
    email = models.EmailField(
        verbose_name='Email-address',
        max_length=255,
        null=False,
        blank=False,
        unique=True,
    )
    last_login = models.DateTimeField(
        verbose_name='Last login time',
        blank=True,
        null=True
    )

    # Personal data
    first_name = models.CharField(
        verbose_name='First name',
        max_length=255,
        null=True,
        blank=True,
        validators=(
            validators.RegexValidator(
                regex=r'^[A-Z]{1}[a-z]+$',
                message='First name must satisfy: "^[A-Z]{1}[a-z]+$"',
                code='invalid_person'
            ),
        )
    )
    last_name = models.CharField(
        verbose_name='Last name',
        max_length=255,
        null=True,
        blank=True,
        validators=(
            validators.RegexValidator(
                regex=r'^[A-Z]{1}[a-z]+$',
                message='Last name must satisfy: "^[A-Z]{1}[a-z]+$"',
                code='invalid_person'
            ),
        )
    )
    sex = models.CharField(
        verbose_name='Sex',
        max_length=7,
        null=True,
        blank=True,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
        ],
    )
    birthdate = models.DateField(
        verbose_name='Birthdate',
        null=True,
        blank=True,
    )
    profile_picture = models.ImageField(
        upload_to=upload_to_profile_picture,
        blank=True,
        default='static/icons/user_icon.png'
    )
    website = models.URLField(
        verbose_name='Website',
        null=True,
        blank=True,
        default=None
    )
    about = models.TextField(
        verbose_name='About me',
        max_length=32767,
        null=True,
        blank=True,
        default=None
    )

    # Flags
    is_public = models.BooleanField(
        verbose_name='Account privacy flag',
        null=True,
        blank=True,
        default=False,
        choices=[
            (True, 'Public'),
            (False, 'Private'),
        ]
    )
    is_active = models.BooleanField(
        verbose_name='Account deletion flag',
        default=True
    )
    is_superuser = models.BooleanField(
        verbose_name='Superuser flag',
        default=False
    )

    _password = None  # raw_password
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = (
        'email',
        'password'
    )

    def __str__(
            self: Self
    ) -> str:
        return self.username

    def save(
            self: Self,
            *args,
            **kwargs
    ):
        super().save(*args, **kwargs)

        if self._password is not None:
            password_validation.password_changed(self._password, self)
            self._password = None

    def clean(
            self: Self
    ) -> None:
        setattr(
            self,
            self.USERNAME_FIELD,
            User.normalize_username(
                self.username
            )
        )

    def natural_key(
            self: Self
    ) -> tuple[str]:
        return (self.username,)

    @property
    def is_staff(
            self: Self
    ) -> bool:
        return self.is_superuser

    @property
    def is_anonymous(
            self: Self
    ) -> bool:
        return False

    @property
    def is_authenticated(
            self: Self
    ) -> bool:
        return True

    @property
    def posts(
            self: Self
    ) -> django.db.models.QuerySet:
        return Post.objects.filter(
            publisher=self
        ).prefetch_related(
            'categories'
        )

    def set_password(
            self: Self,
            raw_password: str
    ) -> None:
        self.password = make_password(raw_password)
        self._password = raw_password

    def check_password(
            self: Self,
            raw_password: str
    ) -> bool:

        def setter(
                raw_password_: str
        ):
            self.set_password(raw_password_)
            self._password = None
            self.save(update_fields=['password'])

        return check_password(raw_password, self.password, setter)

    async def acheck_password(
            self: Self,
            raw_password: str
    ) -> bool:

        async def setter(
                raw_password_: str
        ):
            self.set_password(raw_password_)
            self._password = None
            await self.asave(update_fields=['password'])

        return await acheck_password(raw_password, self.password, setter)

    def set_unusable_password(
            self: Self
    ):
        self.password = make_password(None)

    def has_usable_password(
            self: Self
    ):
        return is_password_usable(self.password)

    def get_session_auth_hash(
            self: Self
    ):
        return self._get_session_auth_hash()

    def get_session_auth_fallback_hash(
            self: Self
    ):
        for fallback_secret in settings.SECRET_KEY_FALLBACKS:
            yield self._get_session_auth_hash(secret=fallback_secret)

    def _get_session_auth_hash(
            self: Self,
            secret=None
    ) -> str:
        key_salt = 'django.contrib.auth.models.AbstractBaseUser.get_session_auth_hash'
        return salted_hmac(
            key_salt,
            self.password,
            secret=secret,
            algorithm='sha256',
        ).hexdigest()

    @classmethod
    def get_email_field_name(
            cls: Self
    ) -> str:
        return 'email'

    @classmethod
    def normalize_username(
            cls: Self,
            username: str
    ) -> str:
        return (
            unicodedata.normalize('NFKC', username)
            if isinstance(username, str)
            else username
        )

    def get_absolute_url(
            self: Self
    ) -> str:
        return str(self.id)

    def get_full_name(
            self: Self
    ) -> str:
        return f'{self.first_name} {self.last_name}'

    def get_short_name(
            self: Self
    ) -> str:
        return self.username

    def has_perm(
            self: Self,
            perm,
            obj=None
    ) -> bool:
        return True

    def has_module_perms(
            self: Self,
            app_label
    ) -> bool:
        return True

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ('username', 'email')
