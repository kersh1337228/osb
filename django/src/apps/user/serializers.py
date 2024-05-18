from django.contrib.auth import aauthenticate
from rest_framework import serializers
from src.async_api.serializers import (
    AsyncModelSerializer,
    AsyncSerializerMethodField,
    validated_method
)
from rest_framework.exceptions import ValidationError
from .models import User
from typing import (
    Self,
    Never
)


class UserRegisterSerializer(AsyncModelSerializer):
    @validated_method
    async def register(
            self: Self
    ) -> None | Never:
        self.instance = await User.objects.acreate_user(
            username=self.validated_data.get('username'),
            email=self.validated_data.get('email'),
            password=self.validated_data.get('password')
        )

    class Meta:
        model = User
        fields = (model.USERNAME_FIELD,) + model.REQUIRED_FIELDS


class UserLoginSerializer(AsyncModelSerializer):
    username = serializers.CharField(validators=())
    password = serializers.CharField(validators=())

    @validated_method
    async def login(
            self: Self
    ) -> dict | Never:
        username_field = 'email' if 'email' in self.initial_data else 'username'
        username = self.validated_data.get(username_field)
        user = await aauthenticate(
            **{username_field: self.validated_data.get(username_field)},
            password=self.validated_data.get('password')
        )

        if not user:
            if await (User.objects.filter(**{
                username_field: username
            })).aexists():
                raise ValidationError(detail={
                    'password': (
                        'Wrong password',
                    )
                })
            else:
                raise ValidationError(detail={
                    username_field: (
                        f'No user with such {username_field}',
                    )
                })

        self.instance = user
        return {
            'id': user.id
        }

    class Meta:
        model = User
        fields = (model.USERNAME_FIELD,) + model.REQUIRED_FIELDS


class UserPartialSerializer(AsyncModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'profile_picture',
            'is_public',
            'is_superuser'
        )

from ..post.serializers import PostPartialSerializer
class UserSerializer(AsyncModelSerializer):
    posts = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_posts(
            user: User
    ):
        return await PostPartialSerializer(
            instance=user.posts,
            many=True
        ).data

    class Meta:
        model = User
        exclude = (
            'password',
        )


class UserEditSerializer(AsyncModelSerializer):
    @validated_method
    async def edit(
            self: Self
    ) -> None | Never:
        if 'password' in self.validated_data:
            self.instance.set_password(
                self.validated_data.pop('password')
            )

        await self.save()

    class Meta:
        model = User
        fields = '__all__'
