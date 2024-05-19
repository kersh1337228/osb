'use server';

import {
    serverRequest
} from '../../../src/actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';
import Post from '../../../src/components/post/Post';

export default async function Page(
    {
        params
    }: {
        params: {
            id: string;
        };
    }
) {
    const post = (await serverRequest(
        `${serverURL}/post/${params.id}`,
        HTTPRequestMethod.GET,
        { cache: 'force-cache' }
    )).data as Post;

    return <Post
        post={post}
    />
}