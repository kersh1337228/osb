import os
import sys
sys.path.append('/home/kersh/dev/python/osb/backend')
os.environ['DJANGO_SETTINGS_MODULE'] = 'src.settings'
import django
django.setup()

import datetime
from src.apps.user.models import User
from src.apps.post.models import (
    Category,
    Post,
    Comment,
    Reply,
    Reaction
)


if __name__ == '__main__':
    User.objects.all().delete()
    Category.objects.all().delete()
    Post.objects.all().delete()
    Comment.objects.all().delete()
    Reply.objects.all().delete()
    Reaction.objects.all().delete()
    # User
    admin = User.objects.create_superuser(
        username='kersh',
        email='antonycherevko@gmail.com',
        password='1337228'
    )
    user = User.objects.create_user(
        username='user',
        email='address@email.com',
        password='password',
        first_name='First',
        last_name='Last',
        sex='male',
        birthdate=datetime.datetime(
            year=2002,
            month=10,
            day=10
        ),
        website='https://github.com/kersh1337228',
        about='I am sample user',
        is_public=True
    )

    # Category
    software_category = Category.objects.create(
        title='Software'
    )
    software_subs = Category.objects.bulk_create((
        Category(title='System', parent_category=software_category),
        Category(title='Data', parent_category=software_category),
        Category(title='Web', parent_category=software_category)
    ))
    hardware_category = Category.objects.create(
        title='Hardware'
    )
    hardware_subs = Category.objects.bulk_create((
        Category(title='Architectures', parent_category=hardware_category),
        Category(title='Systems', parent_category=hardware_category),
        Category(title='Assembly', parent_category=hardware_category)
    ))
    math_category = Category.objects.create(
        title='Math'
    )
    math_subs = Category.objects.bulk_create((
        Category(title='Optimization', parent_category=math_category),
        Category(title='Approximation', parent_category=math_category),
        Category(title='Analysis', parent_category=math_category)
    ))
    # Post
    cpp_post = Post.objects.create(title='About C++', content='Post about C++', publisher=user)
    cpp_post.categories.add(software_category)
    cpp_post.categories.add(software_subs[0])
    django_post = Post.objects.create(title='About Django', content='Post about Python Django', publisher=user)
    django_post.categories.add(software_category)
    django_post.categories.add(software_subs[2])
    x86_post = Post.objects.create(title='About x86', content='Post about x86', publisher=user)
    x86_post.categories.add(software_category)
    x86_post.categories.add(software_subs[0])
    x86_post.categories.add(hardware_category)
    x86_post.categories.add(hardware_subs[0])
    x86_post.categories.add(hardware_subs[2])
    # Comment
    cpp_comments = (
        Comment.objects.create(content='Have you seen C++20?', publisher=admin, commented_post=cpp_post),
        Comment.objects.create(content='Exceptions are actually negative value abstractions', publisher=user, commented_post=cpp_post)
    )
    # Reply
    cpp_comment_replies = (
        Reply.objects.create(content='Use constexpr instead', publisher=user, replied_post=cpp_comments[0]),
        Reply.objects.create(content='Ok, found a proof', publisher=admin, replied_post=cpp_comments[1]),
    )
    Reply.objects.create(content='+', publisher=user, replied_post=cpp_comment_replies[1])
    Reply.objects.create(content='Fine', publisher=admin, replied_post=cpp_comment_replies[0])
    # Reaction
    Reaction.objects.create(type=True, by_user=user, reacted_to=cpp_post)
    Reaction.objects.create(type=False, by_user=admin, reacted_to=cpp_post)
    Reaction.objects.create(type=True, by_user=user, reacted_to=cpp_comments[0])
    Reaction.objects.create(type=True, by_user=admin, reacted_to=cpp_comments[1])
    Reaction.objects.create(type=True, by_user=user, reacted_to=cpp_comment_replies[1])
    Reaction.objects.create(type=True, by_user=admin, reacted_to=cpp_comment_replies[0])
