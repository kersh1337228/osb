from django.views.decorators.csrf import csrf_exempt
from rest_framework.urls import path
from .views import UserRegisterView, UserLoginView, UserAPIView


view = UserAPIView.as_view()


urlpatterns = (
    path(
        'register',
        UserRegisterView.as_view(),
        name='user_register'
    ),
    path(
        'login',
        UserLoginView.as_view(),
        name='user_login'
    ),
    path(
        'logout',
        UserLoginView.as_view(),
        name='user_logout'
    ),
    path(
        '<int:id>',
        view,
        name='user_read'
    ),
    path(
        'update/<int:id>',
        view,
        name='user_update'
    ),
    path(
        'delete/<int:id>',
        view,
        name='user_delete'
    ),
)
