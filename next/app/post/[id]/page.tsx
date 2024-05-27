import {
    serverRequest
} from '../../../src/utils/actions';
import {
    HTTPRequestMethod
} from '../../../src/utils/constants';
import Post from '../../../src/components/post/post/Post';
import {
    Metadata
} from 'next';

export async function generateMetadata(
    {
        params
    }: {
        params: {
            id: number
        }
    }
): Promise<Metadata> {
    const post = (await serverRequest(
        `post/${params.id}`,
        HTTPRequestMethod.GET, {
            cache: 'force-cache'
        }
    )).data as Post;

    return {
        title: post.title
    };
}

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
        `post/${params.id}`,
        HTTPRequestMethod.GET, {
            cache: 'force-cache'
        }
    )).data as Post;
    
    return <Post
        post={post}
    />
}