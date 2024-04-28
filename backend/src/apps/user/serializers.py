from django.contrib.auth import aauthenticate
from rest_framework import serializers
from src.async_api.serializers import AsyncModelSerializer
from .models import User
from typing import (
    Self,
    Dict,
    Any,
    Never,
    Literal
)


class UserRegisterSerializer(AsyncModelSerializer):
    async def register(
            self: Self
    ) -> User | Never:
        if await self.is_valid(raise_exception=True):
            user = await User.objects.acreate_user(
                username=self.validated_data.get('username'),
                email=self.validated_data.get('email'),
                password=self.validated_data.get('password')
            )
            return user

    class Meta:
        model = User
        fields = (model.USERNAME_FIELD,) + model.REQUIRED_FIELDS


class UserLoginSerializer(AsyncModelSerializer):
    username = serializers.CharField(validators=())
    password = serializers.CharField(validators=())

    async def login(
            self: Self,
            username_field: Literal['username', 'email']
    ):
        if await self.is_valid(raise_exception=True):
            return await aauthenticate(
                **{username_field: self.validated_data.get(username_field)},
                password=self.validated_data.get('password')
            )

    class Meta:
        model = User
        fields = (model.USERNAME_FIELD,) + model.REQUIRED_FIELDS


class UserCurrentSerializer(AsyncModelSerializer):
    last_login = serializers.DateTimeField(
        format='%Y/%m/%d %H:%M',
        required=False
    )

    class Meta:
        model = User
        exclude = ('password', 'website', 'about', 'is_active')


class UserSerializer(AsyncModelSerializer):
    last_login = serializers.DateTimeField(
        format='%Y/%m/%d %H:%M',
        required=False
    )

    class Meta:
        model = User
        exclude = ('password',)
