from typing import Self
from rest_framework.exceptions import ValidationError
from django.db import models


class Category(models.Model):
    title = models.CharField(
        verbose_name='Category title',
        max_length=255,
        null=False,
        blank=False,
        unique=True
    )
    parent_category = models.ForeignKey(
        'Category',
        verbose_name='Parent category',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    @property
    def children(
            self: Self
    ) -> models.QuerySet:
        return Category.objects.filter(
            parent_category=self
        ).select_related(
            'parent_category'
        )

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class PostMixin(models.Model):
    content = models.TextField(
        blank=False,
        null=False,
        verbose_name='Post content'
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
            'by_user'
        )

    def __str__(
            self: Self
    ) -> str:
        return self.content[:32]


class Post(PostMixin):
    title = models.CharField(
        verbose_name='Post title',
        max_length=255,
        null=False,
        blank=False
    )
    categories = models.ManyToManyField(
        Category
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
    by_user = models.ForeignKey(
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
            'by_user',
            'reacted_to'
        )
