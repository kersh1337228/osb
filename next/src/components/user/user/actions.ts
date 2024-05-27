'use server';

import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';
import {
    redirect
} from 'next/navigation';

export async function register(
    credentials: RegisterCredentials
) {
    const response = await serverRequest(
        `${serverURL}/user/register`,
        HTTPRequestMethod.POST, {
            cache: 'no-store'
        },
        credentials
    );

    if (response.ok)
        redirect('/user/login');

    return response.data;
}

export async function login(
    credentials: LoginCredentials
) {
    const response = await serverRequest(
        `${serverURL}/user/login`,
        HTTPRequestMethod.POST, {
            cache: 'no-store'
        }, credentials
    );

    if (response.ok && 'id' in response.data)
        redirect(`/user/${response.data.id}`);

    return response.data;
}

export async function logout() {
    const response = await serverRequest(
        `${serverURL}/user/logout`,
        HTTPRequestMethod.POST, {
            cache: 'no-store'
        }
    );

    if (response.ok)
        redirect('/user/login');
}

export async function authenticate(): Promise<UserPartial | null> {
    const response = await serverRequest(
        `${serverURL}/user/authenticate`,
        HTTPRequestMethod.GET, {
            cache: 'force-cache'
        }
    );

    if (!response.ok)
        return null;

    return response.data as UserPartial;
}

export async function deleteUser(
    id: number
) {
    const response = await serverRequest(
        `${serverURL}/user/delete/${id}`,
        HTTPRequestMethod.DELETE, {
            cache: 'no-store'
        }
    );

    if (response.ok)
        redirect('/user/login');

    return response.data;
}
