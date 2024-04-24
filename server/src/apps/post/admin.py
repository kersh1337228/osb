from django.contrib import admin
from .models import (
    Category,
    Post,
    Comment,
    Reply,
    Reaction
)

admin.site.register(Category)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Reply)
admin.site.register(Reaction)
