'use server';

import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod
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
        'post/create',
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
