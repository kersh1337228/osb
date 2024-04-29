from rest_framework import serializers
from src.async_api.serializers import AsyncModelSerializer
from .models import Category
from typing import (
    Self,
    Dict,
    Any,
    Never,
    Literal
)


class CategorySerializer(AsyncModelSerializer):
    children = serializers.Field(source='children')

    class Meta:
        model = Category
        fields = ('id', 'title')
