import PostList from '../../src/components/post/list/PostList';
import {
    serverRequest
} from '../../src/utils/actions';
import {
    HTTPRequestMethod
} from '../../src/utils/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Posts'
};

export default async function Posts() {
    const posts = (await serverRequest(
        'post/list',
        HTTPRequestMethod.POST, {
            cache: 'no-store'
        }
    )).data as PostPartial[];

    return <PostList
        postsInit={posts}
    />;
}
