from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static


urlpatterns = (
    # default
    path('admin/', admin.site.urls),
    # libs
    path('api/', include('rest_framework.urls')),
    # apps
    path('user/', include('src.apps.user.urls'), name='user'),
    path('post/', include('src.apps.post.urls'), name='post')
)


if settings.DEBUG:
    urlpatterns += tuple(static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    ))
