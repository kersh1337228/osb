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

export async function createPost(
    title: string,
    categories: number[],
    content: string
) {
    const response = await serverRequest(
        `${serverURL}/post/create`,
        HTTPRequestMethod.POST, {
            cache: 'no-store'
        }, {
            title,
            categories,
            content
        }
    );

    if (response.ok)
        redirect(`/post/${(response.data as Post).id}`);

    return response.data;
}
