from typing import Self
from src.apps.user.models import User
from src.apps.user.serializers import (
    UserLoginSerializer,
    UserRegisterSerializer,
    UserPartialSerializer,
    UserSerializer,
    UserEditSerializer
)
from src.async_api.class_based import AsyncAPIView
from django.contrib.auth import alogin, alogout
from rest_framework.response import Response
from rest_framework import (
    status,
    permissions, parsers
)


class UserRegisterView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        serializer = UserRegisterSerializer(
            data=request.data
        )

        data, ok = await serializer.register()
        if ok:
            await alogin(request, serializer.instance)
            return Response(
                data={},
                status=status.HTTP_200_OK
            )
        return Response(
            data=data,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserLoginView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        username = request.data.pop('username')
        username_field = 'email' if '@' in username else 'username'

        serializer = UserLoginSerializer(
            data={
                username_field: username,
                'password': request.data.pop('password')
            },
            partial=True
        )

        data, ok = await serializer.login()
        if ok:
            await alogin(request, serializer.instance)
            return Response(
                data=data,
                status=status.HTTP_200_OK
            )
        return Response(
            data=data,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserAuthenticateView(AsyncAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=await UserPartialSerializer(
                instance=request.user
            ).data,
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
    parser_classes = (parsers.JSONParser, parsers.MultiPartParser)

    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        try:
            user = await User.objects.aget(
                id=kwargs.pop('id')
            )

            if (
                    user.id == request.user.id
                    or user.is_public
                    or request.user.is_staff
            ):
                return Response(
                    data=await UserSerializer(
                        instance=user
                    ).data,
                    status=status.HTTP_200_OK
                )

            return Response(
                data={
                    'detail': 'Only staff can view private accounts'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except User.DoesNotExist:
            return Response(
                data={
                    'detail': 'User not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        try:
            serializer = UserEditSerializer(
                instance=await User.objects.aget(
                    id=kwargs.pop('id')
                ),
                data=request.data,
                partial=True
            )

            if serializer.instance.id == request.user.id:
                data, ok = await serializer.edit()
                if ok:
                    return Response(
                        data={},
                        status=status.HTTP_200_OK
                    )
                return Response(
                    data=data,
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                data={
                    'detail': 'Only owner can edit account'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except User.DoesNotExist:
            return Response(
                data={
                    'detail': 'User not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def delete(
            self: Self,
            request,
            *args,
            **kwargs
    ):
        if kwargs.pop('id') == request.user.id:
            user = request.user
            await alogout(request)
            await user.adelete()
            return Response(
                data={},
                status=status.HTTP_200_OK
            )

        return Response(
            data={
                'detail': 'Only owner can permanently delete account'
            },
            status=status.HTTP_403_FORBIDDEN
        )
