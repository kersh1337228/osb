from asyncio import iscoroutinefunction, iscoroutine
from functools import partial

from asgiref.sync import sync_to_async, async_to_sync
from django.contrib import auth
from django.core.exceptions import ImproperlyConfigured
from django.utils.deprecation import MiddlewareMixin
from django.utils.functional import SimpleLazyObject



async def get_user(request):
    if not hasattr(request, "_cached_user"):
        # request._cached_user = auth.get_user(request)
        request._cached_user = await auth.aget_user(request)
    return request._cached_user


async def auser(request):
    if not hasattr(request, "_acached_user"):
        request._acached_user = await auth.aget_user(request)
    return request._acached_user


class AuthenticationMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if not hasattr(request, "session"):
            raise ImproperlyConfigured(
                "The Django authentication middleware requires session "
                "middleware to be installed. Edit your MIDDLEWARE setting to "
                "insert "
                "'django.contrib.sessions.middleware.SessionMiddleware' before "
                "'django.contrib.auth.middleware.AuthenticationMiddleware'."
            )
        # request.user = SimpleLazyObject(lambda: async_to_sync(get_user)(request))
        request.user = async_to_sync(get_user)(request)
        request.auser = partial(auser, request)
