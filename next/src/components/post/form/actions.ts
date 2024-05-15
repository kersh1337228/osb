'use server';

import {
    serverRequest
} from '../../../actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';

export async function createPost(
    title: string,
    categories: string[],
    content: string
) {
    const response = await serverRequest(
        `${serverURL}/post/create`,
        HTTPRequestMethod.POST,
        {
            cache: 'force-cache'
        },
        {},
        {
            title,
            categories,
            content
        }
    ).then(
        response => response.json()
    )
    // ).then(response => {
    //     return response.match;
    // }).catch((response) => {
    //     console.error(response);
    // });
    return response;
}
