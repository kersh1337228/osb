const protocol = 'http';
const serverPort = 8000;
const serverAddress = '127.0.0.1';
export const serverURL = `${protocol}://${serverAddress}:${serverPort}`;

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
