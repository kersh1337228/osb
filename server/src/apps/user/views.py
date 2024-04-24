import django.core.handlers.asgi
from django.shortcuts import render
from django.http import HttpResponse


def test_view(
        request: django.core.handlers.asgi.ASGIRequest
) -> HttpResponse:
    return HttpResponse('<h1>Hello world</h1>')
