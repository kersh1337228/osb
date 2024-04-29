import datetime
from typing import Self
from django.core.exceptions import ValidationError
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


# Mixin for use with objects that can be posted by user
class PostMixin(models.Model):
    content = models.TextField(
        blank=True,
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
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True
    )

    post_id = models.SlugField(
        verbose_name='Post ID',
        max_length=255,
        null=False,
        blank=True,
        unique=True,
    )

    @property
    def reactions(
            self: Self
    ) -> models.QuerySet:
        return Reaction.objects.filter(
            related_post=self
        ).select_related(
            'by_user'
        )

    def __str__(
            self: Self
    ) -> str:
        return self.content[:50]


# User post
class Post(PostMixin):
    title = models.CharField(
        verbose_name='Post title',
        max_length=255,
        null=False,
        blank=False
    )
    categories = models.ManyToManyField(
        Category,
        related_name='post_categories'
    )

    def save(
            self: Self,
            *args,
            **kwargs
    ) -> None:
        if not self.post_id:
            if Post.objects.filter(
                    publisher=self.publisher,
                    title=self.title
            ).exists():
                raise ValidationError(
                    'Title must be unique for publisher')

            now = datetime.datetime.now().strftime("%d_%m_%Y_%H_%M_%S")
            self.post_id = f'{kwargs.get("user").id}_note_{now}'

        super().save(*args, **kwargs)

        self.publisher.posts.add(self)

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'


# Post comment
class Comment(PostMixin):
    related_post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='commented_post'
    )

    @property
    def replies(
            self: Self
    ):
        return Reply.objects.filter(
            comment_replied=self
        ).select_related(
            'publisher'
        )

    def save(
            self: Self,
            *args,
            **kwargs
    ) -> None:
        if not self.comment_id:
            now = datetime.datetime.now().strftime("%d_%m_%Y_%H_%M_%S")
            self.comment_id = f'{self.note_commented.note_id}_comment_{now}'
        super(Comment, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

# Comment reply
class Reply(PostMixin):
    comment_replied = models.ForeignKey(
        'Comment',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comment_replied'
    )

    def save(
            self: Self,
            *args,
            **kwargs
    ) -> None:
        if not self.reply_id:
            now = datetime.datetime.now().strftime("%d_%m_%Y_%H_%M_%S")
            self.reply_id = f'{self.comment_replied.comment_id}_reply_{now}'
        super(Reply, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Reply'
        verbose_name_plural = 'Replies'


# Positive reaction
class Reaction(models.Model):
    type = models.BooleanField(
        verbose_name='Reaction type',
        null=False,
        blank=False,
        choices=[
            (True, 'Positive'),
            (False, 'Negative')
        ]
    )
    by_user = models.ForeignKey(
        'user.User',
        verbose_name='User who reacted',
        on_delete=models.CASCADE,
        null=False,
        blank=True,
    )
    related_post = models.ForeignKey(
        PostMixin,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    # related_comment = models.ForeignKey(
    #     Comment,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    #     related_name='comment_reaction'
    # )
    # related_reply = models.ForeignKey(
    #     Reply,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    #     related_name='reply_reaction'
    # )

    class Meta:
        verbose_name = 'Reaction'
        verbose_name_plural = 'Reactions'
        unique_together = (
            'by_user',
            'related_post'
        )
