from src.apps.post.models import (
    Category,
    Post
)
from src.apps.post.serializers import (
    CategoryEditSerializer,
    CategorySerializer,
    PostEditSerializer,
    PostSerializer,
    PostPartialSerializer,
    CommentEditSerializer,
    ReplyEditSerializer,
    ReactionEditSerializer,
    CommentSerializer,
    ReplySerializer,
    ReactionSerializer, CategoryPartialSerializer
)
from src.async_api.class_based import AsyncAPIView
from rest_framework.response import Response
from rest_framework import (
    status,
    permissions
)


class CategoryEditAPIView(AsyncAPIView):
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
                data=await CategorySerializer(
                    instance=Category.objects.filter(
                        parent_category__isnull=True
                    ).select_related('parent_category'),
                    many=True
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
                    data=await CategorySerializer(
                        instance=Category.objects.filter(
                            parent_category__isnull=True
                        ).select_related('parent_category'),
                        many=True
                    ).data,
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
                data=await CategorySerializer(
                    instance=Category.objects.filter(
                        parent_category__isnull=True
                    ).select_related('parent_category'),
                    many=True
                ).data,
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
            data=await CategorySerializer(
                instance=Category.objects.filter(
                    parent_category__isnull=True
                ).select_related('parent_category'),
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
            data=await CategoryPartialSerializer(
                instance=Category.objects.filter(
                    title__icontains=request.data.pop('title')
                ),
                many=True
            ).data,
            status=status.HTTP_200_OK
        )


class CategoryAPIView(AsyncAPIView):
    async def get(
            self,
            request,
            *args,
            **kwargs
    ):
        return Response(
            data=await CategoryPartialSerializer(
                instance=Category.popularity_order(
                    Category.objects.select_related('parent_category'),
                    int(request.query_params.get('limit', 5))
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
            data=await CategorySerializer(
                instance=Category.objects.filter(
                    title__icontains=request.data.pop('title')
                ).select_related('parent_category'),
                many=True
            ).data,
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
                    'detail': f'Only owner or staff can delete {
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
                    instance=await Post.objects
                        .select_related('publisher')
                        .prefetch_related('categories')
                        .aget(
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

        offset = request.data.get('offset', 0)
        limit = request.data.get('limit', 5)

        return Response(
            data=await PostPartialSerializer(
                instance=Post.objects
                    .filter(**query)
                    .select_related('publisher')
                    .prefetch_related('categories')
                    .distinct()[offset:offset + limit],
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
