#!/usr/bin/env python
import os
import sys
import uvicorn
from django.core.management import execute_from_command_line


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.settings')
    if 'runserver' in sys.argv:
        uvicorn.run(
            app='src.asgi:application',
            host='0.0.0.0',
            port=8000,
            reload=True,
            interface='asgi3',
            lifespan='off'
        )
    else:
        execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
