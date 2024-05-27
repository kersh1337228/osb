import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    authenticate
} from './src/components/user/user/actions';

const auth = /(^\/user\/register$)|(^\/user\/login$)/g;
const noAuth = /(^\/user\/\d+$)|(^\/post\/create$)/g;
const superuser = /(^\/post\/category\/\d+$)/g;

export async function middleware(
    request: NextRequest
) {
    if (
        request.nextUrl.pathname.match(auth)
        && request.cookies.has('sessionid')
    ) {
        const user = await authenticate();
        if (user)
            return NextResponse.redirect(
                new URL(`/user/${user.id}`, request.url));
    } else if (
        request.nextUrl.pathname.match(noAuth)
        && !request.cookies.has('sessionid')
    )
        return NextResponse.redirect(
            new URL('/user/login', request.url));
    else if (
        request.nextUrl.pathname.match(superuser)
        && request.cookies.has('sessionid')
    ) {
        const user = await authenticate();
        if (user && !user.is_superuser)
            return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}
