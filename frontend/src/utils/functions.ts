import {
    HTTPRequestMethod
} from './constants';

export function getCookie(
    name: string
): string {
    let cookieValue = '';
    const start = `${name}=`;

    if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.replace(' ', '');
            if (cookie.startsWith(start)) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

export function formDataSerialize(
    formData: FormData
): Object {
    const obj: Record<string, any> = {};

    for (const [key, val] of formData.entries())
        obj[key] = val;

    return obj;
}

const safeMethods = [
    'GET',
    'HEAD',
    'TRACE',
    'OPTIONS'
];

export async function jsonRequest(
    url: string,
    method: HTTPRequestMethod,
    params: Record<string, any> = {},
    body: Record<string, any> | string | null = {},
    headers: Record<string, string> = {},
): Promise<Response> {
    if (safeMethods.includes(method)) {
        url += '?' + new URLSearchParams(body as Record<string, any>);
        body = null;
    } else {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken)
            headers['X-CSRFToken'] = csrftoken;
        // const sessionid = getCookie('sessionid');
        // if (sessionid)
            // headers['X-CSRFToken'] = csrftoken;
        body = JSON.stringify(body);
    }
    return fetch(
        url,
        {
            ...params,
            method,
            headers: {
                ...headers,
                'Accepts': 'application/json',
                'Content-Type': 'application/json',
            },
            // mode: 'cors',
            // credentials: 'include',
            body: body as string
        }
    );
}
