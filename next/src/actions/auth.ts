'use server';

import {
    serverRequest
} from './request';
import {
    HTTPRequestMethod,
    serverURL
} from '../utils/constants';
import { redirect } from 'next/navigation';

export declare type UserCredentials = {
    username: string;
    email: string;
    password: string;
};

export async function login(
    credentials: UserCredentials
) {
    const response = await serverRequest(
        `${serverURL}/user/login`,
        HTTPRequestMethod.POST,
        {
            cache: 'no-store'
        },
        {},
        credentials
    ).then(
        response => response.json()
    )

    if ('id' in response)
        redirect(`/user/${response.id}`);

    return response;
}

export async function register(
    credentials: UserCredentials
) {
    const response = await serverRequest(
        `${serverURL}/user/register`,
        HTTPRequestMethod.POST,
        {
            cache: 'no-store'
        },
        {},
        credentials
    );

    return await response.json().then(response => {
        return response;
    }).catch((response) => {
        console.error(response);
    });
}

export async function authenticate() {
    const response = await serverRequest(
        `${serverURL}/user/authenticate`,
        HTTPRequestMethod.GET,
        {
            cache: 'force-cache'
        }
    );

    if (!response.ok)
        return null;

    return await response.json();
}
