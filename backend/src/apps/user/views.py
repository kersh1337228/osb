from typing import Self
from src.apps.user.models import User
from src.apps.user.serializers import (
    UserSerializer,
    UserLoginSerializer
)
from src.async_api.class_based import AsyncAPIView
from django.contrib.auth import alogin
from rest_framework.response import Response
from rest_framework import (
    parsers,
    renderers,
    status,
    permissions
)


class UserRegisterView(AsyncAPIView):
    permission_classes = (permissions.AllowAny,)

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        print(request.__dict__, args, kwargs)


        return Response(
            data={},
            status=200
        )


class UserLoginView(AsyncAPIView):
    permission_classes = (permissions.AllowAny,)

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        username = request.data.get('username')
        username_field = 'email' if '@' in username else 'username'

        serializer = UserLoginSerializer(data={
            username_field: username,
            'password': request.data.get('password')
        }, partial=True)
        user = await serializer.login(username_field)
        if not user:
            pass
        await alogin(request, user)

        return Response(
            data={
                'csrftoken': request.META.get('CSRF_COOKIE'),
                'sessionid': request.session.session_key
            },
            status=status.HTTP_200_OK
        )


class UserAPIView(AsyncAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        try:
            user = await User.objects.aget(
                id=kwargs.get('id')
            )

            return Response(
                data={
                    'user': UserSerializer(user).data
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                data={
                    'message': 'User not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def delete(
            self: Self,
            request,
            *args,
            **kwargs
    ):
        pass
