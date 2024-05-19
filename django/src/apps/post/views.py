from src.apps.post.models import (
    Category,
    Post
)
from src.apps.post.serializers import (
    CategoryEditSerializer,
    CategoryListSerializer,
    PostEditSerializer,
    PostSerializer,
    PostPartialSerializer,
    CommentEditSerializer,
    ReplyEditSerializer,
    ReactionEditSerializer,
    CommentSerializer,
    ReplySerializer,
    ReactionSerializer
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
        serializer = CategoryEditSerializer(
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
            serializer = CategoryEditSerializer(
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

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=Category.objects.filter(
                title__icontains=request.data.pop('query')
            ).values(
                'id',
                'title'
            ),
            status=status.HTTP_200_OK
        )


class PostEditAPIViewMixin(AsyncAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer = None
    edit_serializer = None

    @property
    def post_model(self):
        return self.edit_serializer.Meta.model

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        serializer = self.edit_serializer(
            data=request.data | {
                'publisher': request.user.id
            }
        )

        data, ok = await serializer.create_or_update()
        if ok:
            return Response(
                data=await self.serializer(
                    instance=data
                ).data,
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
            post = await self.post_model.objects.aget(
                id=kwargs.pop('id')
            )
            if post.publisher_id == request.user.id:
                serializer = self.edit_serializer(
                    instance=post,
                    data=request.data,
                    partial=True
                )

                data, ok = await serializer.create_or_update()
                if ok:
                    return Response(
                        data=await self.serializer(
                            instance=data
                        ).data,
                        status=status.HTTP_200_OK
                    )
                return Response(
                    data=data,
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(
                data={
                    'detail': f'Only owner can update {
                        self.post_model.__name__.lower()
                    }'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except Post.DoesNotExist:
            return Response(
                data={
                    'detail': f'{
                        self.post_model.__name__
                    } not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def delete(
            self,
            request,
            *args,
            **kwargs
    ):
        post = self.post_model.objects.filter(
            id=kwargs.pop('id')
        )
        if await post.aexists():
            if request.user.id == await post.values_list(
                    'publisher_id', flat=True
            ).afirst() or request.user.is_staff:
                await post.adelete()
                return Response(
                    data={},
                    status=status.HTTP_200_OK
                )
            return Response(
                data={
                    'detail': f'Only owner or admin can delete {
                        self.post_model.__name__.lower()
                    }'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        return Response(
            data={
                'detail': f'{
                    self.post_model.__name__
                } not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


class PostEditAPIView(PostEditAPIViewMixin):
    serializer = PostSerializer
    edit_serializer = PostEditSerializer


class PostAPIView(AsyncAPIView):
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
        except Post.DoesNotExist:
            return Response(
                data={
                    'detail': 'Post not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    async def post(
            self,
            request,
            *args,
            **kwargs
    ):
        query = {}

        title = request.data.get('title')
        if title:
            query |= {'title__icontains': title}

        categories = request.data.get('categories')
        if categories:
            query |= {'categories__in': categories}

        publish_time__start = request.data.get('publish_time__start')
        if publish_time__start:
            query |= {'publish_time__gte': publish_time__start}

        publish_time__end = request.data.get('publish_time__end')
        if publish_time__end:
            query |= {'publish_time__lte': publish_time__end}

        update_time__start = request.data.get('update_time__start')
        if publish_time__start:
            query |= {'update_time__gte': update_time__start}

        update_time__end = request.data.get('update_time__end')
        if update_time__end:
            query |= {'update_time__lte': update_time__end}

        publisher = request.data.get('publisher')
        if publisher:
            query |= {'publisher': publisher}

        return Response(
            data=await PostPartialSerializer(
                instance=Post.objects.filter(**query).distinct(),
                many=True
            ).data,
            status=status.HTTP_200_OK
        )


class CommentEditAPIView(PostEditAPIViewMixin):
    serializer = CommentSerializer
    edit_serializer = CommentEditSerializer


class ReplyEditAPIView(PostEditAPIViewMixin):
    serializer = ReplySerializer
    edit_serializer = ReplyEditSerializer


class ReactionEditAPIView(PostEditAPIViewMixin):
    serializer = ReactionSerializer
    edit_serializer = ReactionEditSerializer
