// TODO: deploy
// export const serverURL = 'http://django:8000';
export const serverURL = 'http://0.0.0.0:8000';

export enum HTTPRequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    TRACE = 'TRACE',
    OPTIONS = 'OPTIONS'
}

export const safeHTTPRequestMethods = [
    HTTPRequestMethod.GET,
    HTTPRequestMethod.HEAD,
    HTTPRequestMethod.TRACE,
    HTTPRequestMethod.OPTIONS
];

export const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
})
