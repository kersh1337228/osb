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
from .utils import parse
from ..user.models import User
from ..user.serializers import UserPartialSerializer


# _______________________________|CATEGORY|_______________________________
class CategoryEditSerializer(AsyncModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

    @validated_method
    async def create_or_update(
            self: Self
    ) -> None | Never:
        if self.instance:
            parent = self.validated_data.get('parent_category')
            if parent:
                if parent.id == self.instance.id:
                    raise ValidationError(detail={
                        'parent_category': (
                            "Category can't be its own parent",
                        ),
                    })
                if await self.instance.is_child(parent):
                    raise ValidationError(detail={
                        'parent_category': (
                            "Parent can't be a child of its own children",
                        ),
                    })

        return await self.save()


class CategoryPartialSerializer(AsyncModelSerializer):
    class Meta:
        model = Category
        fields = (
            'id',
            'title'
        )


class CategorySerializer(AsyncModelSerializer):
    children = AsyncSerializerMethodField(read_only=True)
    posts = AsyncSerializerMethodField(read_only=True)
    parent_category = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_children(
            category: Category
    ) -> dict:
        return await CategorySerializer(
            instance=category.children,
            many=True
        ).data

    @staticmethod
    async def get_posts(
            category: Category
    ) -> int:
        return await category.posts.acount()

    @staticmethod
    async def get_parent_category(
            category: Category
    ) -> dict | None:
        return await CategoryPartialSerializer(
            instance=category.parent_category
        ).data if category.parent_category else None

    class Meta:
        model = Category
        fields = '__all__'


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


class PostPartialSerializerMixin(PostSerializerMixin):
    categories = AsyncSerializerMethodField(read_only=True)
    comments = AsyncSerializerMethodField(read_only=True)

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


class PostPartialSerializer(PostPartialSerializerMixin):
    content = serializers.SerializerMethodField(read_only=True)

    @staticmethod
    def get_content(
            post: Post
    ):
        return post.__str__()

    class Meta:
        model = Post
        exclude = (
            'content_parsed',
        )


class PostSerializer(PostPartialSerializerMixin):
    comments = AsyncSerializerMethodField(read_only=True)

    @staticmethod
    async def get_comments(
            post: Post
    ):
        return await CommentSerializer(
            instance=post.comments,
            many=True
        ).data

    class Meta:
        model = Post
        fields = '__all__'


class PostEditSerializerMixin(AsyncModelSerializer):
    @validated_method
    async def create_or_update(
            self: Self
    ) -> None | Never:
        if 'content' in self.validated_data:
            self.validated_data['content_parsed'] = parse(
                self.validated_data.get('content')
            )
        return await self.save()


class PostEditSerializer(PostEditSerializerMixin):
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


class CommentEditSerializer(PostEditSerializerMixin):
    class Meta:
        model = Comment
        fields = '__all__'


# _______________________________|REPLY|_______________________________
class ReplySerializer(CommentSerializerMixin):
    class Meta:
        model = Reply
        exclude = ('replied_post',)


class ReplyEditSerializer(PostEditSerializerMixin):
    class Meta:
        model = Reply
        fields = '__all__'
