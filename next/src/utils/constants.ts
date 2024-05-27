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

export const orders = [{
    name: 'Best',
    value: 'best'
}, {
    name: 'New',
    value: 'new'
}, {
    name: 'Old',
    value: 'old'
}, {
    name: 'Worst',
    value: 'worst'
}];

export const minDate = new Date(999999999999).toJSON().slice(0, 19);
export const maxDate = new Date(1900000000000).toJSON().slice(0, 19);
