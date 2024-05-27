import PostList from '../../src/components/post/list/PostList';
import {
    serverRequest
} from '../../src/utils/actions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../src/utils/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Posts'
};

export default async function Posts() {
    const posts = (await serverRequest(
        `${serverURL}/post/list`,
        HTTPRequestMethod.POST, {
            cache: 'force-cache'
        }
    )).data as PostPartial[];

    return <PostList
        postsInit={posts}
    />;
}
