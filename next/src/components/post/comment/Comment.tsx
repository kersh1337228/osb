import {
    dateTimeFormat
} from '../../../utils/constants';
import styles from './styles.module.css';
import Reply from '../reply/Reply';
import Reactions from '../reaction/Reactions';
import Publisher from '../../user/publisher/Publisher';

export default function Comment(
    {
        comment
    }: {
        comment: PostComment;
    }
) {
    return <li
        className={styles.postListItem}
    >
        <div
            className={styles.postHeader}
        >
            <Publisher
                user={comment.publisher}
            />
            <div>
                <div
                    className={styles.postDate}
                >
                    created: {dateTimeFormat.format(
                    new Date(comment.publish_time)
                )}
                </div>
                <div
                    className={styles.postDate}
                >
                    updated: {dateTimeFormat.format(
                    new Date(comment.update_time)
                )}
                </div>
            </div>
        </div>
        <p
            className={styles.postContent}
        >
            {comment.content}
        </p>
        <Reactions
            reactions={comment.reactions}
            reacted_to={comment.id}
        />
        <ul>
            {comment.replies.map((reply, key) =>
                <Reply
                    key={key}
                    reply={reply}
                />
            )}
        </ul>
    </li>;
}
