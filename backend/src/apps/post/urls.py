from django.urls import path
from . import views


urlpatterns = (
    path(
        'category/list',
        views.CategorySearchAPIView.as_view(),
        name='category_list'
    ),
)
