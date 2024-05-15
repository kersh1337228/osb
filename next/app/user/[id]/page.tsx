'use server';

import {
    serverRequest
} from '../../../src/actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';

export default async function UserPage(
    {
        params
    }: {
        params: {
            id: string;
        };
    }
) {
    const response = await serverRequest(
        `${serverURL}/user/${params.id}`,
        HTTPRequestMethod.GET,
        {
            cache: 'force-cache'
        }
    ).then(
        response => response.json()
    ).then(response => {
        return response;
    }).catch((response) => {
        console.error(response);
    });

    return (
        <main>
            <h1>{params.id}</h1>
            <h1>{response.user.username}</h1>
        </main>
    );
}
