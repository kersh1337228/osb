import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    authenticate
} from './src/actions/auth';

const auth = /(\/user\/register)|(\/user\/login)/g;
const noAuth = /(\/user\/\d+)|(\/post\/create)/g;

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

    return NextResponse.next();
}
