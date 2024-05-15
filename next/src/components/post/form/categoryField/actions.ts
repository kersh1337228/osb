'use server';

import {
    serverRequest
} from '../../../../actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../../utils/constants';

export async function matchCategory(
    query?: string
): Promise<string[]> {
    if (query) {
        return await serverRequest(
            `${serverURL}/post/category/list`,
            HTTPRequestMethod.GET,
            {
                cache: 'force-cache'
            },
            {
                query: query
            }
        ).then(
            response => response.json()
        ).then(response => {
            return response.match;
        }).catch((response) => {
            console.error(response);
        });
    }
    return [];
}