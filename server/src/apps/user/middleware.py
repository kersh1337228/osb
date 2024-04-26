from typing import Awaitable, Callable, Self
from urllib.parse import urlsplit
from asgiref.sync import iscoroutinefunction, async_to_sync, sync_to_async
from asgiref.sync import markcoroutinefunction
from django.http import HttpRequest
from django.http.response import HttpResponseBase
from django.utils.cache import patch_vary_headers
from corsheaders.conf import conf

class CookieMiddleware:
    sync_capable = True
    async_capable = True

    def __init__(
        self: Self,
        get_response: (
            Callable[[HttpRequest], HttpResponseBase]
            | Callable[[HttpRequest], Awaitable[HttpResponseBase]]
        ),
    ) -> None:
        self.get_response = get_response
        self.async_mode = iscoroutinefunction(self.get_response)
        if self.async_mode:
            markcoroutinefunction(self)

    def __call__(
            self: Self,
            request: HttpRequest
    ) -> HttpResponseBase | Awaitable[HttpResponseBase]:
        if self.async_mode:
            return self.__acall__(request)
        result = self.get_response(request)
        assert isinstance(result, HttpResponseBase)
        response = result
        async_to_sync(self.add_response_headers)(request, response)
        return response

    async def __acall__(
            self: Self,
            request: HttpRequest
    ) -> HttpResponseBase:
        result = self.get_response(request)
        assert not isinstance(result, HttpResponseBase)
        response = await result
        await self.add_response_headers(request, response)
        return response

    async def add_response_headers(
            self: Self,
            request: HttpRequest,
            response: HttpResponseBase
    ) -> HttpResponseBase:
        response.data['cookies'] = []
        for name in response.cookies:
            cookie = response.cookies.get(name)
            response.data['cookies'].append({
                'name': name,
                'value': cookie.value,
                'expires': cookie['expires']
            })

        # if hasattr(response, "render") and callable(response.render):
        #     try:
        #         if iscoroutinefunction(response.render):
        #             response = await response.render()
        #         else:
        #             response = await sync_to_async(
        #                 response.render, thread_sensitive=True
        #             )()
        #     except Exception as e:
        #         response = await sync_to_async(
        #             self.process_exception_by_middleware,
        #             thread_sensitive=True,
        #         )(e, request)
        #         if response is None:
        #             raise

        return response
