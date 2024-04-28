from asgiref.sync import sync_to_async, async_to_sync
from rest_framework.authentication import (
    BaseAuthentication,
    get_authorization_header,
    CSRFCheck
)
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _
from typing import Self


class AsyncSessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        user = getattr(request._request, 'user', None)

        if not user or not user.is_active:
            return None

        self.enforce_csrf(request)

        return (user, None)

    def enforce_csrf(self, request):

        def dummy_get_response(_):
            return None

        check = CSRFCheck(dummy_get_response)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)


class AsyncTokenAuthentication(BaseAuthentication):
    keyword = 'Token'
    model = None

    def get_model(self):
        if self.model is not None:
            return self.model
        from rest_framework.authtoken.models import Token
        return Token

    def authenticate(
            self: Self,
            request
    ):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            msg = _('Invalid token header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid token header. Token string should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth[1].decode()
        except UnicodeError:
            msg = _('Invalid token header. Token string should not contain invalid characters.')
            raise exceptions.AuthenticationFailed(msg)

        return self.authenticate_credentials(token)

    def authenticate_credentials(
            self: Self,
            key: str
    ):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        return (token.user, token)

    def authenticate_header(self, request):
        return self.keyword
