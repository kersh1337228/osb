import {
    dateTimeFormat
} from '../../../../utils/constants';
import Link from 'next/link';
import CommentIcon from '../../../misc/icons/Comment';
import Publisher from '../../../user/publisher/Publisher';
import Reactions from '../../reaction/Reactions';
import styles from './styles.module.css';

export default function PostListItem(
    {
        post
    }: {
        post: PostPartial
    }
) {
    return <li
        className={styles.postListItem}
    >
        <div
            className={styles.header}
        >
            <span>
                <Publisher
                    user={post.publisher}
                />
                <Link
                    href={`/post/${post.id}`}
                    className={styles.title}
                >
                    {post.title}
                </Link>
            </span>
            <div>
                <div
                    className={styles.date}
                >
                    created: {dateTimeFormat.format(
                    new Date(post.publish_time)
                )}
                </div>
                <div
                    className={styles.date}
                >
                    updated: {dateTimeFormat.format(
                    new Date(post.update_time)
                )}
                </div>
            </div>
        </div>
        <ul
            className={styles.categories}
        >
            {post.categories.map(category => {
                const params = new URLSearchParams();
                params.set('categories', JSON.stringify([category]));

                return <li
                    key={category.id}
                >
                    <Link
                        href={`/post?${params.toString()}`}
                        className={styles.category}
                    >
                        {category.title}
                    </Link>
                </li>;
            })}
        </ul>
        <div
            dangerouslySetInnerHTML={{
                __html: `${post.content}...`
            }}
            className={styles.content}
        ></div>
        <div
            className={styles.footer}
        >
            <Link
                href={`/post/${post.id}#comments`}
                className={styles.comments}
            >
            <CommentIcon/> {post.comments}
            </Link>
            <Reactions
                post={post}
            />
        </div>
    </li>;
}
