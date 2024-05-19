import {
    serverRequest
} from '../../../actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';
import PostListItem from './PostListItem';
import styles from './styles.module.css';
import Link from 'next/link';

export default async function PostList() {
    const posts = (await serverRequest(
        `${serverURL}/post/list`,
        HTTPRequestMethod.POST,
        {
            cache: 'force-cache'
        }
    )).data as PostPartial[];

    return <main
        className={styles.main}
    >
        <section
            className={styles.section}
        >
            {/*<h1*/}
            {/*    className={styles.sectionHeader}*/}
            {/*>*/}
            {/*    Controls*/}
            {/*</h1>*/}
            <ul>
                <li>
                    <Link
                        href={'post/create'}
                        className={styles.postCategory}
                    >
                        Add new post
                    </Link>
                </li>
            </ul>
        </section>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                Latest posts
            </h1>
            <ul>
                {posts.map((post, key) =>
                    <PostListItem
                        post={post}
                        key={post.id}
                    />
                )}
            </ul>
        </section>
    </main>;
}
