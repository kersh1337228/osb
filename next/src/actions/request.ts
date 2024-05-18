'use server';

import {
    HTTPRequestMethod,
    safeHTTPRequestMethods
} from '../utils/constants';
import {
    cookies
} from 'next/headers';

export async function serverRequest(
    url: string,
    method: HTTPRequestMethod,
    options: Record<string, any> = {},
    data: Record<string, any> | FormData = {},
    headers: Record<string, string> = {}
): Promise<JSONResponse> {
    const cookieStore = cookies();

    const sessionid = cookieStore.get('sessionid')?.value;
    if (sessionid)
        headers['Cookie'] = `sessionid=${sessionid}`

    let body: string | FormData | null;
    if (safeHTTPRequestMethods.includes(method)) {
        const queryParams = new URLSearchParams(data as Record<string, any>);
        url += queryParams.size ? queryParams : '';
        body = null;
    } else {
        const csrftoken = cookieStore.get('csrftoken')?.value;
        if (csrftoken) {
            headers['Cookie'] += `;csrftoken=${csrftoken}`;
            headers['X-CSRFToken'] = csrftoken;
        }

        if (data instanceof FormData)
            body = data;
        else {
            body = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        }
    }

    const response = await fetch(
        url,
        {
            ...options,
            method,
            headers,
            credentials: 'include',
            body
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

    return {
        data: await response.json().catch(_ => {}),
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        redirected: response.redirected,
        bodyUsed: response.bodyUsed
    }
}
