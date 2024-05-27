import PostCreate from '../../../src/components/post/create/PostCreate';
import {
    Metadata
} from 'next';

export const metadata: Metadata = {
    title: 'Create post'
};

export default async function Page() {
    return <PostCreate />;
}
