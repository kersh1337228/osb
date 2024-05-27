from django.urls import path
from . import views


urlpatterns = (
    # category
    path(  # post
        'category/create',
        views.CategoryEditAPIView.as_view(),
        name='category_create'
    ),
    path(  # patch
        'category/update/<int:id>',
        views.CategoryEditAPIView.as_view(),
        name='category_update'
    ),
    path(  # delete
        'category/delete/<int:id>',
        views.CategoryEditAPIView.as_view(),
        name='category_delete'
    ),
    path(  # get & post
        'category/list',
        views.CategoryListAPIView.as_view(),
        name='category_list'
    ),
    path(  # get & post
        'category',
        views.CategoryAPIView.as_view(),
        name='category'
    ),
    # post
    path(  # post
        'create',
        views.PostEditAPIView.as_view(),
        name='post_create'
    ),
    path(  # patch
        'update/<int:id>',
        views.PostEditAPIView.as_view(),
        name='post_update'
    ),
    path(  # delete
        'delete/<int:id>',
        views.PostEditAPIView.as_view(),
        name='post_delete'
    ),
    path(  # get
        '<int:id>',
        views.PostAPIView.as_view(),
        name='post_read'
    ),
    path(  # post
        'list',
        views.PostAPIView.as_view(),
        name='post_list'
    ),
    # comment
    path(  # post
        'comment/create',
        views.CommentEditAPIView.as_view(),
        name='comment_create'
    ),
    path(  # patch
        'comment/update/<int:id>',
        views.CommentEditAPIView.as_view(),
        name='comment_update'
    ),
    path(  # delete
        'comment/delete/<int:id>',
        views.CommentEditAPIView.as_view(),
        name='comment_delete'
    ),
    # reply
    path(  # post
        'reply/create',
        views.ReplyEditAPIView.as_view(),
        name='reply_create'
    ),
    path(  # patch
        'reply/update/<int:id>',
        views.ReplyEditAPIView.as_view(),
        name='reply_update'
    ),
    path(  # delete
        'reply/delete/<int:id>',
        views.ReplyEditAPIView.as_view(),
        name='reply_delete'
    ),
    # reaction
    path(  # post
        'reaction/create',
        views.ReactionEditAPIView.as_view(),
        name='reaction_create'
    ),
    path(  # patch
        'reaction/update/<int:id>',
        views.ReactionEditAPIView.as_view(),
        name='reaction_update'
    ),
    path(  # delete
        'reaction/delete/<int:id>',
        views.ReactionEditAPIView.as_view(),
        name='reaction_delete'
    )
)
