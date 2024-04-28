'use server';

import {
    jsonRequest
} from './request';
import {
    HTTPRequestMethod,
    serverURL
} from '../utils/constants';

export declare type UserCredentials = {
    username: string;
    email: string;
    password: string;
};

export async function login(
    credentials: UserCredentials
) {
    const response = await jsonRequest(
        `${serverURL}/api/user/login`,
        HTTPRequestMethod.POST,
        {
            cache: 'no-store'
        },
        credentials
    );

    return await response.json().then(response => {
        return response;
    }).catch((response) => {
        console.error(response);
    });
}

export async function register(
    credentials: UserCredentials
) {
    const response = await jsonRequest(
        `${serverURL}/api/user/register`,
        HTTPRequestMethod.POST,
        {
            cache: 'no-store'
        },
        credentials
    );

    return await response.json().then(response => {
        return response;
    }).catch((response) => {
        console.error(response);
    });
}

export async function getCurrentUser() {
    const response = await jsonRequest(
        `${serverURL}/api/user/current`,
        HTTPRequestMethod.GET,
        {
            cache: 'force-cache'
        }
    );

    return await response.json().then(response => {
        console.log(response)
        return response;
    }).catch((response) => {
        console.error(response);
    });
}
