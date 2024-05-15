from rest_framework.urls import path
from . import views


view = views.UserAPIView.as_view()


urlpatterns = (
    # auth
    path( # post
        'register',
        views.UserRegisterView.as_view(),
        name='auth_register'
    ),
    path( # post
        'login',
        views.UserLoginView.as_view(),
        name='auth_login'
    ),
    path( # get
        'authenticate',
        views.UserAuthenticateView.as_view(),
        name='auth_authenticate'
    ),
    path( # post
        'logout',
        views.UserLogoutView.as_view(),
        name='auth_logout'
    ),
    # user
    path( # get
        '<int:id>',
        view,
        name='user_read'
    ),
    path( # patch
        'update/<int:id>',
        view,
        name='user_update'
    ),
    path( # delete
        'delete/<int:id>',
        view,
        name='user_delete'
    )
)
