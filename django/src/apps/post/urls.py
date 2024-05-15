from django.urls import path
from . import views


urlpatterns = (
    # category
    path( # post
        'category/create',
        views.CategoryAPIView.as_view(),
        name='category_create'
    ),
    path( # patch
        'category/update/<int:id>',
        views.CategoryAPIView.as_view(),
        name='category_update'
    ),
    path( # delete
        'category/delete/<int:id>',
        views.CategoryAPIView.as_view(),
        name='category_delete'
    ),
    path( # get
        'category/list',
        views.CategoryListAPIView.as_view(),
        name='category_list'
    ),
    path( # get
        'category/search',
        views.CategorySearchAPIView.as_view(),
        name='category_search'
    ),
    # post
    path(
        'create',
        views.PostAPIView.as_view(),
        name='post_create'
    ),
    path(
        '<int:id>',
        views.PostAPIView.as_view(),
        name='post_read'
    ),
    path(
        'update/<int:id>',
        views.PostAPIView.as_view(),
        name='post_update'
    ),
    path(
        'delete/<int:id>',
        views.PostAPIView.as_view(),
        name='post_delete'
    ),
    path(
        'list',
        views.PostListAPIView.as_view(),
        name='post_list'
    ),
    path(
        'search',
        views.PostSearchAPIView.as_view(),
        name='post_list'
    ),
    # comment
    path(
        'comment/create',
        views.PostAPIView.as_view(),
        name='comment_create'
    ),
    path(
        'comment/update/<int:id>',
        views.PostAPIView.as_view(),
        name='comment_update'
    ),
    path(
        'comment/delete/<int:id>',
        views.PostAPIView.as_view(),
        name='comment_delete'
    ),
    # reply
    path(
        'reply/create',
        views.PostAPIView.as_view(),
        name='reply_create'
    ),
    path(
        'reply/update/<int:id>',
        views.PostAPIView.as_view(),
        name='reply_update'
    ),
    path(
        'reply/delete/<int:id>',
        views.PostAPIView.as_view(),
        name='reply_delete'
    ),
    # reaction
    path(
        'reaction/create',
        views.PostAPIView.as_view(),
        name='reaction_create'
    ),
    path(
        'reaction/update/<int:id>',
        views.PostAPIView.as_view(),
        name='reaction_update'
    ),
    path(
        'reaction/delete/<int:id>',
        views.PostAPIView.as_view(),
        name='reaction_delete'
    )
)
