import {
    dateTimeFormat
} from '../../../utils/constants';
import styles from './styles.module.css';
import Reactions from '../reaction/Reactions';
import Publisher from '../../user/publisher/Publisher';

export default function Reply(
    {
        reply
    }: {
        reply: Reply;
    }
) {
    return <li
        className={styles.reply}
    >
        <div
            className={styles.header}
        >
            <Publisher
                user={reply.publisher}
            />
            <div>
                <div
                    className={styles.date}
                >
                    created: {dateTimeFormat.format(
                    new Date(reply.publish_time)
                )}
                </div>
                <div
                    className={styles.date}
                >
                    updated: {dateTimeFormat.format(
                    new Date(reply.update_time)
                )}
                </div>
            </div>
        </div>
        <p
            className={styles.content}
        >
            {reply.content}
        </p>
        <Reactions
            reactions={reply.reactions}
            reacted_to={reply.id}
        />
        <ul
            className={styles.replies}
        >
            {reply.replies.map((reply, key) =>
                <Reply
                    key={key}
                    reply={reply}
                />
            )}
        </ul>
    </li>;
}
