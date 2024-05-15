import {
    NextRequest,
    NextResponse
} from 'next/server';

export const config = {
    matcher: [
        '/post/create'
    ],
}

export async function middleware(
    request: NextRequest
) {
    if (request.cookies.has('sessionid'))
        return NextResponse.next();

    return NextResponse.redirect(
        new URL('/auth/login', request.url));
}
