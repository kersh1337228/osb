from typing import Self
from src.apps.user.models import User
from src.apps.user.serializers import (
    UserSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
    UserCurrentSerializer
)
from src.async_api.class_based import AsyncAPIView
from django.contrib.auth import alogin, alogout
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
        serializer = UserRegisterSerializer(data={
            'username': request.data.get('username'),
            'email': request.data.get('email') ,
            'password': request.data.get('password')
        })
        user = await serializer.register()

        return Response(
            data={},
            status=status.HTTP_201_CREATED
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
                'id': request.user.id
            },
            status=status.HTTP_200_OK
        )


class UserCurrentView(AsyncAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        if request.user.is_authenticated:
            return Response(
                data={
                    'user': UserCurrentSerializer(request.user).data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            data={
                'user': None
            },
            status=status.HTTP_200_OK
        )


class UserLogoutView(AsyncAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        await alogout(request)
        return Response(
            data={},
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
