from rest_framework.request import Request
from rest_framework.response import Response
from src.async_api.class_based import AsyncAPIView
import types
from collections.abc import Coroutine
from typing import (
    Self,
    Any,
    Callable,
    TypeAlias
)


AsyncView: TypeAlias = Callable[
    [Request, tuple[Any, ...], dict[str, Any]],
    Coroutine[Any, Any, Response]
]


def async_api_view(
        http_method_names: tuple[str, ...] = None
) -> Callable[[Any], Any]:
    http_method_names = ['GET'] if http_method_names is None else http_method_names

    def decorator(
            func: AsyncView
    ):
        WrappedAPIView = type(
            'WrappedAPIView',
            (AsyncAPIView,),
            {
                '__doc__': func.__doc__
            }
        )

        assert not isinstance(http_method_names, types.FunctionType), (
            '@async_api_view missing list of allowed HTTP methods'
        )

        assert isinstance(http_method_names, (list, tuple)), (
                '@async_api_view expected a list of strings, received %s'
                % type(http_method_names).__name__
        )

        allowed_methods = set(http_method_names) | {'options'}
        WrappedAPIView.http_method_names = [method.lower() for method in allowed_methods]

        async def handler(
                self: Self,
                *args,
                **kwargs
        ) -> Any:
            return await func(*args, **kwargs)

        for method in http_method_names:
            setattr(WrappedAPIView, method.lower(), handler)

        WrappedAPIView.__name__ = func.__name__
        WrappedAPIView.__module__ = func.__module__
        WrappedAPIView.renderer_classes = getattr(
            func, 'renderer_classes',
            AsyncAPIView.renderer_classes
        )
        WrappedAPIView.parser_classes = getattr(
            func, 'parser_classes',
            AsyncAPIView.parser_classes
        )
        WrappedAPIView.authentication_classes = getattr(
            func, 'authentication_classes',
            AsyncAPIView.authentication_classes
        )
        WrappedAPIView.throttle_classes = getattr(
            func, 'throttle_classes',
            AsyncAPIView.throttle_classes
        )
        WrappedAPIView.permission_classes = getattr(
            func, 'permission_classes',
            AsyncAPIView.permission_classes
        )
        WrappedAPIView.schema = getattr(
            func, 'schema',
            AsyncAPIView.schema
        )
        return WrappedAPIView.as_view()

    return decorator
