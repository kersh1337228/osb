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

export async function deletePost(
    id: number
) {
    const response = await serverRequest(
        `post/delete/${id}`,
        HTTPRequestMethod.DELETE, {
            cache: 'no-store'
        }
    );

    if (response.ok)
        redirect('/post/');

    return response.data;
}
