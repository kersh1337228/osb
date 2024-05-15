// TODO: unneeded file
import type {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    IncomingMessage,
    ServerResponse
} from 'http';
import type {
    ReadonlyRequestCookies
} from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {
    RequestCookies,
    ResponseCookies
} from 'next/dist/server/web/spec-extension/cookies';

type CookieSerializeOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    partitioned?: boolean;
    path?: string;
    priority?: 'low' | 'medium' | 'high';
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
};

interface DefaultOptions extends CookieSerializeOptions {
    res?: ServerResponse;
    req?: IncomingMessage & {
        cookies?: Record<string, string>;
    };
    cookies?: () => ReadonlyRequestCookies;
}

type AppRouterOptions = {
    res?: Response | NextResponse;
    req?: Request | NextRequest;
    cookies?: () => ReadonlyRequestCookies;
};

export function parse(
    str: string
): Record<string, string> {
    const obj = {} as Record<string, string>;

    let index = 0;
    while (index < str.length) {
        const eqIdx = str.indexOf('=', index);

        if (eqIdx === -1)
            break;

        let endIdx = str.indexOf(';', index);

        if (endIdx === -1)
            endIdx = str.length;
        else if (endIdx < eqIdx) {
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }

        const key = str.slice(index, eqIdx).trim();
        if (undefined === obj[key]) {
            let val = str.slice(eqIdx + 1, endIdx).trim();

            if (val.charAt(0) === '"')
                val = val.slice(1, -1)

            try {
                obj[key] = val ? val.replace(
                    /(%[0-9A-Z]{2})+/g,
                    decodeURIComponent
                ) : val;
            } catch (e) {
                obj[key] = val;
            }
        }

        index = endIdx + 1;
    }

    return obj;
}

function serialize(
    name: string,
    val: string,
    options?: CookieSerializeOptions
) {
    const opt = options || {};
    const value = encodeURIComponent(val);

    let str = name + '=' + value;

    if (opt.maxAge)
        str += '; Max-Age=' + Math.floor(opt.maxAge);

    if (opt.domain)
        str += '; Domain=' + opt.domain;

    if (opt.path)
        str += '; Path=' + opt.path;

    if (opt.expires)
        str += '; Expires=' + opt.expires.toUTCString()

    if (opt.httpOnly)
        str += '; HttpOnly';

    if (opt.secure)
        str += '; Secure';

    if (opt.partitioned)
        str += '; Partitioned';

    if (opt.priority)
        str += `; Priority=${
            opt.priority.charAt(0).toUpperCase() + opt.priority.slice(1)
        }`;

    if (opt.sameSite)
        switch (typeof opt.sameSite === 'string'
            ? opt.sameSite.toLowerCase() : opt.sameSite) {
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
        }

    return str;
}

function isCookiesFromAppRouter(
    cookieStore: Record<string, string>
        | ResponseCookies
        | RequestCookies
        | undefined,
): cookieStore is ResponseCookies | RequestCookies {
    if (!cookieStore)
        return false;

    return (
        'getAll' in cookieStore &&
        'set' in cookieStore &&
        typeof cookieStore.getAll === 'function' &&
        typeof cookieStore.set === 'function'
    );
}

function isContextFromAppRouter(
    context?: DefaultOptions | AppRouterOptions,
): context is {
    res?: NextResponse;
    req?: NextRequest;
    cookies?: () => ReadonlyRequestCookies;
} {
    return (
        (!!context?.req && 'cookies' in context.req && isCookiesFromAppRouter(context?.req.cookies)) ||
        (!!context?.res && 'cookies' in context.res && isCookiesFromAppRouter(context?.res.cookies)) ||
        (!!context?.cookies && isCookiesFromAppRouter(context.cookies()))
    );
}

function transformAppRouterCookies(
    cookies: ResponseCookies | RequestCookies
): Record<string, string> {
    let _cookies: Record<string, string> = {};
    cookies.getAll().forEach(({ name, value }) => {
        _cookies[name] = value;
    });
    return _cookies;
}

function stringify(
    value: string = ''
) {
    try {
        const result = JSON.stringify(value);
        return /^[{\[]/.test(result) ? result : value;
    } catch (e) {
        return value;
    }
}

export function getCookies(
    options?: DefaultOptions | AppRouterOptions
): Record<string, string> {
    if (isContextFromAppRouter(options))
        if (options?.req)
            return transformAppRouterCookies(
                options.req.cookies);
        if (options?.cookies)
            return transformAppRouterCookies(
                options.cookies());

    let req;
    if (options)
        req = options.req as DefaultOptions['req'];

    if (typeof window === 'undefined') {
        if (req && req.cookies)
            return req.cookies;

        if (req && req.headers.cookie)
            return parse(req.headers.cookie);

        return {};
    }

    const _cookies: Record<string, string> = {};
    const documentCookies = document.cookie ? document.cookie.split('; ') : [];

    for (let i = 0, len = documentCookies.length; i < len; i++) {
        const cookieParts = documentCookies[i].split('=');

        const _cookie = cookieParts.slice(1).join('=');
        const name = cookieParts[0];

        _cookies[name] = _cookie;
    }

    return _cookies;
}

export function getCookie(
    key: string,
    options?: DefaultOptions | AppRouterOptions
): string | undefined {
    const _cookies = getCookies(options);
    const val = _cookies[key];
    if (val === undefined)
        return undefined;

    return val ? val.replace(
        /(%[0-9A-Z]{2})+/g,
        decodeURIComponent
    ) : val;
}

export function setCookie(
    key: string,
    data: any,
    options?: DefaultOptions | AppRouterOptions
): void {
    if (isContextFromAppRouter(options)) {
        const {
            req,
            res,
            cookies: cookiesFn,
            ...restOptions
        } = options;
        const payload = {
            name: key,
            value: data,
            ...restOptions
        };

        if (req)
            req.cookies.set(payload);

        if (res)
            res.cookies.set(payload);

        if (cookiesFn)
            cookiesFn().set(payload);

        return;
    }
    let _cookieOptions: any;
    let _req;
    let _res;
    if (options) {
        const {
            req,
            res,
            ..._options
        } = options as DefaultOptions;
        _req = req;
        _res = res;
        _cookieOptions = _options;
    }

    const cookieStr = serialize(key, stringify(data), {
        path: '/',
        ..._cookieOptions
    });
    if (window === undefined && _res && _req) {
        let currentCookies = _res.getHeader('Set-Cookie');

        if (!Array.isArray(currentCookies))
            currentCookies = !currentCookies ? [] : [String(currentCookies)];
        _res.setHeader('Set-Cookie', currentCookies.concat(cookieStr));

        if (_req && _req.cookies) {
            const _cookies = _req.cookies;
            data === '' ? delete _cookies[key] : (_cookies[key] = stringify(data));
        }

        if (_req && _req.headers && _req.headers.cookie) {
            const _cookies = parse(_req.headers.cookie);

            data === '' ? delete _cookies[key] : (_cookies[key] = stringify(data));

            _req.headers.cookie = Object.entries(_cookies).reduce((accum, item) => {
                return accum.concat(`${item[0]}=${item[1]};`);
            }, '');
        }
    } else
        document.cookie = cookieStr;
}

export function deleteCookie(
    key: string,
    options?: DefaultOptions | AppRouterOptions
): void {
    return setCookie(key, '', { ...options, maxAge: -1 });
}

export function hasCookie(
    key: string,
    options?: DefaultOptions | AppRouterOptions
): boolean {
    if (!key)
        return false;

    const cookie = getCookies(options);
    return cookie.hasOwnProperty(key);
}
