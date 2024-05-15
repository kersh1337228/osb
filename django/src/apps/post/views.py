from functools import reduce

from django.db.models import Q

from src.apps.post.models import Category, Post
from src.apps.post.serializers import (
    CategorySerializer,
    PostSerializer, CategoryListSerializer
)
from src.async_api.class_based import AsyncAPIView
from rest_framework.response import Response
from rest_framework import (
    status,
    permissions
)


class CategoryAPIView(AsyncAPIView):
    permission_classes = (permissions.IsAdminUser,)

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        serializer = CategorySerializer(
            data=request.data
        )

        data, ok = await serializer.create_or_update()
        if ok:
            return Response(
                data={},
                status=status.HTTP_200_OK
            )
        return Response(
            data=data,
            status=status.HTTP_400_BAD_REQUEST
        )

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        try:
            serializer = CategorySerializer(
                instance=await Category.objects.aget(
                    id=kwargs.pop('id')
                ),
                data=request.data,
                partial=True
            )

            data, ok = await serializer.create_or_update()
            if ok:
                return Response(
                    data={},
                    status=status.HTTP_200_OK
                )
            return Response(
                data=data,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Category.DoesNotExist:
            return Response(
                data={
                    'detail': 'Category not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        category = Category.objects.filter(
            id=kwargs.pop('id')
        )
        if await category.aexists():
            await category.adelete()
            return Response(
                data={},
                status=status.HTTP_200_OK
            )
        return Response(
            data={
                'detail': 'Category not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


class CategoryListAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=await CategoryListSerializer(
                instance=Category.objects.filter(
                    parent_category__isnull=True
                ),
                many=True
            ).data,
            status=status.HTTP_200_OK
        )


class CategorySearchAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=Category.objects.filter(
                title__icontains=request.query_params.get('query')
            ).values(
                'id',
                'title'
            ),
            status=status.HTTP_200_OK
        )


class PostAPIView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        if request.user.is_authenticated:
            serializer = PostSerializer(
                data=request.data | {
                    'publisher': request.user.id
                }
            )

            data, ok = await serializer.create_or_update()
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
                'detail': 'Authentication credentials where not provided'
            },
            status=status.HTTP_403_FORBIDDEN
        )

    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        try:
            return Response(
                data=await PostSerializer(
                    instance=await Post.objects.aget(
                        id=kwargs.pop('id')
                    )
                ).data,
                status=status.HTTP_200_OK
            )
        except Category.DoesNotExist:
            return Response(
                data={
                    'detail': 'Post not found'
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
                post = await Post.objects.aget(
                    id=kwargs.pop('id')
                )
                if request.user.id == post.publisher_id:
                    serializer = PostSerializer(
                        instance=post,
                        data=request.data,
                        partial=True
                    )

                    data, ok = await serializer.create_or_update()
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
                        'detail': 'Only owner can update post'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            except Category.DoesNotExist:
                return Response(
                    data={
                        'detail': 'Post not found'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        post = Post.objects.filter(
            id=kwargs.pop('id')
        )
        if await post.aexists():
            if request.user.id == await post.values_list(
                    'id', flat=True
            ).afirst():
                await post.adelete()
                return Response(
                    data={},
                    status=status.HTTP_200_OK
                )
            return Response(
                data={
                    'detail': 'Only owner can delete post'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        return Response(
            data={
                'detail': 'Post not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


class PostListAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=await CategoryListSerializer(
                instance=Category.objects.filter(
                    parent_category__isnull=True
                ),
                many=True
            ).data,
            status=status.HTTP_200_OK
        )


class PostSearchAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        categories = request.query_params.get('categories')
        return Response(
            data=await PostSerializer(
                instance=Post.objects.filter(
                    title__icontains=request.query_params.get('query'),
                    **({'categories__in': categories} if categories else {})
                ),
                many=True
            ).data,
            status=status.HTTP_200_OK
        )


class CommentAPIView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        pass


class ReplyAPIView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        pass


class ReactionAPIView(AsyncAPIView):
    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def patch(
            self,
            request,
            *args,
            **kwargs
    ):
        pass

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        pass
