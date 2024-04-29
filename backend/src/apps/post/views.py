from typing import Self

from src.apps.post.models import Category
from src.apps.user.models import User
from src.apps.post.serializers import (
    CategorySerializer
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


class CategorySearchAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        query = request.query_params.get('query')
        if query:
            return Response(
                data={
                    'match': Category.objects.filter(
                        title__contains=query
                    ).values_list('title', 'id', flat=True)
                },
                status=status.HTTP_200_OK
            )
        return Response(
            data={
                'match': await CategorySerializer(
                    Category.objects.all(), many=True).adata()
            },
            status=status.HTTP_200_OK
        )


class CategoryAPIView(AsyncAPIView):
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
