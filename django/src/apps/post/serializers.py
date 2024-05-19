from typing import (
    Self,
    Never
)
from asgiref.sync import sync_to_async
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from src.async_api.serializers import (
    AsyncModelSerializer,
    AsyncSerializerMethodField,
    validated_method
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
from ..user.models import User
from ..user.serializers import UserPartialSerializer


# _______________________________|CATEGORY|_______________________________
class CategoryEditSerializer(AsyncModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryListSerializer(AsyncModelSerializer):
    children = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_children(
            category: Category
    ):
        return await CategoryListSerializer(
            instance=category.children,
            many=True
        ).data

    class Meta:
        model = Category
        fields = (
            'id',
            'title',
            'children'
        )


# _______________________________|REACTION|_______________________________
class ReactionSerializer(AsyncModelSerializer):
    publisher = AsyncSerializerMethodField()

    @staticmethod
    async def get_publisher(
            reaction: Reaction
    ):
        return await UserPartialSerializer(
            instance=reaction.publisher
        ).data

    class Meta:
        model = Reaction
        fields = (
            'id',
            'type',
            'publisher'
        )


class ReactionEditSerializer(AsyncModelSerializer):
    @validated_method
    async def create_or_update(
            self: Self
    ) -> None | Never:
        if not self.instance and self.validated_data.get('publisher').id == (
                await sync_to_async(lambda post: post.publisher)(
                    self.validated_data.get('reacted_to')
                )
        ).id:
            raise ValidationError(detail={
                'publisher': (
                    "Owner can't comment his own post",
                ),
                'reacted_to': (
                    "Post can't be commented by owner",
                )
            })

        return await self.save()

    class Meta:
        model = Reaction
        fields = '__all__'


# _______________________________|POST|_______________________________
class PostSerializerMixin(AsyncModelSerializer):
    reactions = AsyncSerializerMethodField(read_only=True)
    publisher = AsyncSerializerMethodField()

    def __new__(
            cls,
            *args,
            **kwargs
    ):
        if kwargs.get('many', False) and 'instance' in kwargs:
            kwargs['instance'] = PostMixin.rating_order(kwargs['instance'])
        return super().__new__(
            cls,
            *args,
            **kwargs
        )

    @staticmethod
    async def get_publisher(
            post: PostMixin
    ):
        return await UserPartialSerializer(
            instance=await User.objects.aget(
                id=post.publisher_id
            )
        ).data

    @staticmethod
    async def get_reactions(
            post: PostMixin
    ):
        reactions = post.reactions
        return {
            'neg': await ReactionSerializer(
                instance=reactions.filter(type=False),
                many=True
            ).data,
            'pos': await ReactionSerializer(
                instance=reactions.filter(type=True),
                many=True
            ).data
        }


class PostPartialSerializer(PostSerializerMixin):
    categories = AsyncSerializerMethodField(read_only=True)
    content = serializers.SerializerMethodField(read_only=True)
    comments = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    def get_content(
            post: Post
    ):
        return post.__str__()

    @staticmethod
    async def get_categories(
            post: Post
    ):
        return post.categories.values(
            'id',
            'title'
        )

    @staticmethod
    async def get_comments(
            post: Post
    ):
        return await post.comments.acount()

    class Meta:
        model = Post
        fields = '__all__'


class PostSerializer(PostPartialSerializer):
    comments = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_comments(
            post: Post
    ):
        return await CommentSerializer(
            instance=post.comments,
            many=True
        ).data


class PostEditSerializer(AsyncModelSerializer):
    class Meta:
        model = Post
        exclude = (
            'publish_time',
            'update_time'
        )


# _______________________________|COMMENT|_______________________________
class CommentSerializerMixin(PostSerializerMixin):
    replies = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_replies(
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


class CommentEditSerializer(AsyncModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


# _______________________________|REPLY|_______________________________
class ReplySerializer(CommentSerializerMixin):
    class Meta:
        model = Reply
        exclude = ('replied_post',)


class ReplyEditSerializer(AsyncModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'
