from typing import Self
from django.core import validators
from django.dispatch import receiver
from rest_framework.exceptions import ValidationError
from django.db import models


class Category(models.Model):
    title = models.CharField(
        verbose_name='Category title',
        max_length=255,
        null=False,
        blank=False,
        unique=True,
        validators=(
            validators.RegexValidator(
                regex=r'^[A-Z]{1}.+$',
                message='Category title must satisfy: "^[A-Z]{1}[a-z]+$"',
                code='invalid_person'
            ),
        )
    )
    parent_category = models.ForeignKey(
        'Category',
        verbose_name='Parent category',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    async def is_child(
            self: Self,
            category: 'Category'
    ) -> bool:
        children = Category.objects.filter(
            parent_category=self
        )

        if await children.acontains(category):
            return True

        async for child in children:
            if await child.is_child(category):
                return True

        return False

    @property
    def children(
            self: Self
    ) -> models.QuerySet:
        return Category.objects.filter(
            parent_category=self
        ).select_related(
            'parent_category'
        )

    @property
    def posts(
            self: Self
    ) -> models.QuerySet:
        return Post.objects.filter(
            categories__in=[self]
        )

    @staticmethod
    async def popularity_order(
            categories: models.QuerySet,
            limit: int = None
    ):
        temp = []
        async for category in categories:
            temp.append((
                await Post.objects.filter(
                    categories__in=[category]
                ).acount(),
                category
            ))
        temp.sort(key=lambda pair: pair[0], reverse=True)

        for pair in temp[:limit]:
            yield pair[1]

    def __str__(
            self: Self
    ) -> str:
        return self.title

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


@receiver(
    models.signals.post_delete,
    sender=Category
)
async def auto_delete_post_on_delete(
        signal,
        sender,
        **kwargs
):
    posts = kwargs.get('instance').posts.prefetch_related('categories')

    async for post in posts:
        if await post.categories.acount() == 1:
            await post.adelete()


class PostMixin(models.Model):
    content = models.TextField(
        blank=False,
        null=False,
        verbose_name='Post content'
    )
    content_parsed = models.TextField(
        blank=False,
        null=False,
        verbose_name='Parsed content'
    )
    publish_time = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Publication time'
    )
    update_time = models.DateTimeField(
        auto_now=True,
        verbose_name='Last update time'
    )

    # Related user
    publisher = models.ForeignKey(
        'user.User',
        on_delete=models.CASCADE,
        blank=False,
        null=False
    )

    @property
    def reactions(
            self: Self
    ) -> models.QuerySet:
        return Reaction.objects.filter(
            reacted_to=self
        ).select_related(
            'publisher'
        )

    @staticmethod
    async def rating_order(
            posts: models.QuerySet
    ):
        temp = []
        async for post in posts:
            reactions = Reaction.objects.filter(
                reacted_to=post
            ).values_list(
                'type',
                flat=True
            )

            pos = 0
            async for reaction in reactions:
                pos += reaction

            temp.append((2 * pos - await reactions.acount(), post))
        temp.sort(key=lambda pair: pair[0], reverse=True)

        for pair in temp:
            yield pair[1]

    def __str__(
            self: Self
    ) -> str:
        return self.content_parsed[:128]

    class Meta:
        get_latest_by = '-update_time'
        ordering = (
            '-update_time',
            '-publish_time'
        )


class Post(PostMixin):
    title = models.CharField(
        verbose_name='Post title',
        max_length=255,
        null=False,
        blank=False,
        validators=(
            validators.RegexValidator(
                regex=r'^[A-Z]{1}.+$',
                message='Post title must satisfy: "^[A-Z]{1}[a-z]+$"',
                code='invalid_person'
            ),
        )
    )
    categories = models.ManyToManyField(
        to=Category
    )

    @property
    def comments(
            self: Self
    ):
        return Comment.objects.filter(
            commented_post=self
        ).select_related(
            'publisher'
        )

    def save(
            self: Self,
            *args,
            **kwargs
    ) -> None:
        if self.pk is None and Post.objects.filter(
                publisher=self.publisher,
                title=self.title
        ).exists():
            raise ValidationError(detail={
                'title': (
                    'Title must be unique for publisher',
                )
            })
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'


class CommentMixin(PostMixin):
    @property
    def replies(
            self: Self
    ):
        return Reply.objects.filter(
            replied_post=self
        ).select_related(
            'publisher'
        )


class Comment(CommentMixin):
    commented_post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'


class Reply(CommentMixin):
    replied_post = models.ForeignKey(
        PostMixin,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='related_post'
    )

    class Meta:
        verbose_name = 'Reply'
        verbose_name_plural = 'Replies'


class Reaction(models.Model):
    type = models.BooleanField(
        verbose_name='Reaction type',
        null=False,
        blank=False,
        choices=[
            (True, '+'),
            (False, '-')
        ]
    )
    publisher = models.ForeignKey(
        'user.User',
        verbose_name='User who reacted',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    reacted_to = models.ForeignKey(
        PostMixin,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    class Meta:
        verbose_name = 'Reaction'
        verbose_name_plural = 'Reactions'
        unique_together = (
            'publisher',
            'reacted_to'
        )
