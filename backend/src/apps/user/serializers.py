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


class UserSerializer(AsyncModelSerializer):
    last_login = serializers.DateTimeField(
        format='%Y/%m/%d %H:%M',
        required=False
    )

    async def register(
            self: Self
    ) -> User | Never:
        if self.is_valid(raise_exception=True):
            user = User.objects.create_user(
                self.validated_data.get('username'),
                self.validated_data.get('email'),
                self.validated_data.get('password')
            )
            return user


    class Meta:
        model = User
        exclude = ('id', 'password')
        optional_fields = ('created', 'last_updated', 'slug')
