from rest_framework import serializers
from src.async_api.serializers import (
    AsyncModelSerializer,
    AsyncSerializerMethodField,
    validated_method,
)
from .models import (
    Category,
    PostMixin,
    Post,
    CommentMixin,
    Comment,
    Reply,
    Reaction
)
from typing import (
    Self,
    Never
)

from ..user.models import User


class CategorySerializer(AsyncModelSerializer):
    @validated_method
    async def create_or_update(
            self: Self
    ) -> None | Never:
        await self.save()

    class Meta:
        model = Category
        fields = '__all__'


class CategoryListSerializer(AsyncModelSerializer):
    children = AsyncSerializerMethodField(read_only=True)

    async def get_children(
            self: Self,
            category: Category
    ):
        return await CategorySerializer(
            instance=category.children,
            many=True
        ).data

    class Meta:
        model = Category
        fields = ('id', 'title', 'children')


class PostSerializerMixin(AsyncModelSerializer):
    reactions = AsyncSerializerMethodField(read_only=True)
    publisher = AsyncSerializerMethodField(read_only=True)

    async def get_reactions(
            self: Self,
            post: PostMixin
    ):
        return post.reactions.values(
            'type',
            'by_user',
            'by_user__username',
            'by_user__profile_picture'
        )

    async def get_publisher(
            self: Self,
            post: PostMixin
    ):
        return await User.objects.values(
            'id',
            'username',
            'profile_picture',
            'is_public',
            'is_superuser'
        ).aget(
            id=post.publisher_id
        )

    @validated_method
    async def create_or_update(
            self: Self
    ) -> None | Never:
        await self.save()


class CommentSerializerMixin(PostSerializerMixin):
    replies = AsyncSerializerMethodField(read_only=True)

    async def get_replies(
            self: Self,
            post: CommentMixin
    ):
        return await ReplySerializer(
            instance=post.replies,
            many=True
        ).data


class CommentSerializer(CommentSerializerMixin):
    class Meta:
        model = Comment
        exclude = ('commented_post',)


class ReplySerializer(CommentSerializerMixin):
    class Meta:
        model = Reply
        exclude = ('replied_post',)


class PostSerializer(PostSerializerMixin):
    categories = AsyncSerializerMethodField()
    comments = AsyncSerializerMethodField(read_only=True)

    async def get_categories(
            self: Self,
            post: Post
    ):
        return post.categories.values(
            'id',
            'title'
        )

    async def get_comments(
            self: Self,
            post: Post
    ):
        return await CommentSerializer(
            instance=post.comments,
            many=True
        ).data

    class Meta:
        model = Post
        fields = '__all__'
