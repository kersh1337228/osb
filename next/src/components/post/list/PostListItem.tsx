import {
    dateTimeFormat
} from '../../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';
import CommentIcon from '../../misc/icons/Comment';

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
            className={styles.postHeader}
        >
            <span
                className={styles.postPublisher}
            >
                <Link
                    href={`/user/${post.publisher.id}`}
                >
                    <Image
                        src={post.publisher.profile_picture ?? '/img/user.webp'}
                        alt={'User profile picture'}
                        width={32}
                        height={32}
                        unoptimized={true}
                        className={styles.publisherPicture}
                    />
                </Link>
                <Link
                    href={`/post/${post.id}`}
                    className={styles.postTitle}
                >
                    {post.title}
                </Link>
            </span>
            <div>
                <div
                    className={styles.postDate}
                >
                    created: {dateTimeFormat.format(
                        new Date(post.publish_time)
                    )}
                </div>
                <div
                    className={styles.postDate}
                >
                    updated: {dateTimeFormat.format(
                        new Date(post.update_time)
                    )}
                </div>
            </div>
        </div>
        <ul
            className={styles.postCategories}
        >
            {post.categories.map((category, key) =>
                <li
                    key={category.id}
                >
                    <Link
                        href={`/post/category/${category.id}`}
                        className={styles.postCategory}
                    >
                        {category.title}
                    </Link>
                </li>
            )}
        </ul>
        <p
            className={styles.postContent}
        >
            {post.content}...
        </p>
        <div
            className={styles.postMeta}
        >
            <div>
                <span
                    className={styles.postNegative}
                >
                    - {post.reactions.neg.length}
                </span> / <span
                    className={styles.postPositive}
                >
                    + {post.reactions.pos.length}
                </span>
            </div>
            <Link
                href={`/post/${post.id}#comments`}
                className={styles.comments}
            >
                <CommentIcon /> {post.comments}
            </Link>
        </div>
    </li>;
}
