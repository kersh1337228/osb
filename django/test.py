import asyncio
from typing import (
    Coroutine,
    Self,
    Never, Callable, Any, Tuple, Dict, List
)
from rest_framework.exceptions import ValidationError


class Base:
    def __init__(self, field: bool):
        self.field = field

    async def is_valid(self, **kwargs):
        print('is_valid')
        if not self.field:
            raise ValidationError(detail={
                'field': (
                    'Error',
                )
            })
        return True


def validated(
        callback: Callable[[Base], Coroutine]
) -> Callable[[Base], Coroutine[Any, Any, tuple[dict, bool]]]:
    async def f(
            self: Base
    ):
        try:
            if await self.is_valid(raise_exception=True):
                return await callback(self), True
        except ValidationError as err:
            errors = {}
            for key, details in err.detail.items():
                errors[key] = list(map(str, details))
            return errors, False
    return f


class Test(Base):
    @validated
    async def method(
            self: Self
    ) -> None | Never:
        print('method')
        return {
            'id': 1
        }


async def main():
    test = Test(True)
    res = await test.method()
    print(res)


if __name__ == '__main__':
    el = asyncio.new_event_loop()
    el.run_until_complete(main())
    el.close()
