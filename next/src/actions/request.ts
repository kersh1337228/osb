'use server';

import {
    safeMethods
} from '../utils/functions';
import {
    HTTPRequestMethod
} from '../utils/constants';
import {
    cookies
} from 'next/headers';

export async function serverRequest(
    url: string,
    method: HTTPRequestMethod,
    options: Record<string, any> = {},
    params: Record<string, any> = {},
    body: Record<string, any> | string | null = {},
    headers: Record<string, string> = {},
): Promise<Response> {
    const cookieStore = cookies();

    if (safeMethods.includes(method)) {
        url += '?' + new URLSearchParams(body as Record<string, any>);
        body = null;
    } else {
        const csrftoken = cookieStore.get('csrftoken')?.value;
        if (csrftoken)
            headers['X-CSRFToken'] = csrftoken;

        body = JSON.stringify(body);
    }

    const sessionid = cookieStore.get('sessionid')?.value;
    if (sessionid)
        headers['Cookie'] = `sessionid=${sessionid}`

    const queryParams = new URLSearchParams();
    for (const key in params)
        queryParams.set(key, params[key]);

    const response = await fetch(
        `${url}${queryParams.toString()}`,
        {
            ...options,
            method,
            headers: {
                ...headers,
                'Accepts': 'application/json',
                'Content-Type': 'application/json',
            },
            // mode: 'cors',
            credentials: 'include',
            body: body as string
        }
    );

    for (const cookie of response.headers.getSetCookie()) {
        const raw = cookie.split('; ');
        const pair = raw[0].split('=');
        const params = {} as Record<string, any>;
        for (const log of raw) {
            const [key, value] = log.split('=');
            params[key] = value;
        }

        cookieStore.set({
            name: pair[0],
            value: pair[1],
            expires: 'expires' in params ? new Date(params.expires) : undefined,
            httpOnly: 'HttpOnly' in params,
            maxAge: 'Max-Age' in params ? Number(params['Max-Age']) : undefined,
            path: params['Path'],
            sameSite: 'SameSite' in params ? params['SameSite'].toLowerCase() : undefined,
            secure: 'Secure' in params
        });
    }

    return response;
}
