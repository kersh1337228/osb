'use client';

import {
    dateTimeFormat,
    HTTPRequestMethod,
    orders
} from '../../../utils/constants';
import styles from './styles.module.css';
import Reactions from '../reaction/Reactions';
import Publisher from '../../user/publisher/Publisher';
import ReplyIcon from '../../misc/icons/Reply';
import TextField from '../../misc/form/TextField';
import {
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    useFormState
} from 'react-dom';
import {
    serverRequest
} from '../../../utils/actions';
import {
    ratingOrder,
    timeOrder
} from '../../../utils/functions';
import {
    UserContext
} from '../../misc/providers/UserProvider';
import Select from '../../misc/form/Select';
import EditableText from '../../misc/editable/EditableText';

export default function Reply(
    {
        reply,
        onDelete
    }: {
        reply: Reply;
        onDelete: () => void;
    }
) {
    const user = useContext(UserContext);

    const [replies, setReplies] = useState(reply.replies);
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState(reply.content);
    const [contentParsed, setContentParsed] = useState(reply.content_parsed);

    const [order, setOrder] = useState<Order>('best');

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [formState, dispatch] = useFormState(async (
        _: Record<string, string[]>,
        formData: FormData
    ) => {
        const response = await serverRequest(
            'post/reply/create',
            HTTPRequestMethod.POST, {
                cache: 'no-store'
            }, {
                replied_post: reply.id,
                content: formData.get('content')
            }
        );
        if (response.ok) {
            setReplies(replies => replies
                .concat(response.data as Reply)
                .toSorted(ratingOrder)
            );
            // @ts-ignore
            contentRef.current.value = '';
            contentRef.current?.dispatchEvent(
                new Event('input', { bubbles: true }));
            return {};
        } else
            return response.data;
    }, {});

    useEffect(() => {
        switch (order) {
            case 'best':
                setReplies(replies => replies.toSorted(ratingOrder));
                break;
            case 'new':
                setReplies(replies => replies.toSorted(timeOrder));
                break;
            case 'old':
                setReplies(replies => replies.toSorted((a, b) => -timeOrder(a, b)));
                break;
            case 'worst':
                setReplies(replies => replies.toSorted((a, b) => -ratingOrder(a, b)));
                break;
        }
    }, [order, replies.length]);

    return <li>
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
                    created: <time suppressHydrationWarning>
                        {dateTimeFormat.format(new Date(reply.publish_time))}
                    </time>
                </div>
                <div
                    className={styles.date}
                >
                    updated: <time suppressHydrationWarning>
                        {dateTimeFormat.format(new Date(reply.update_time))}
                    </time>
                </div>
            </div>
        </div>
        {user && (user.id === reply.publisher.id || user.is_superuser) ? <EditableText
            value={content}
            setValue={async (content: string) => {
                const response = await serverRequest(
                    `post/reply/update/${reply.id}`,
                    HTTPRequestMethod.PATCH, {
                        cache: 'no-store'
                    }, {
                        content
                    }
                );

                if (response.ok) {
                    setContentParsed(response.data.content_parsed);
                    setContent(response.data.content);
                }

                return response;
            }}
            onDelete={async () => {
                const response = await serverRequest(
                    `post/reply/delete/${reply.id}`,
                    HTTPRequestMethod.DELETE, {
                        cache: 'no-store'
                    }
                );

                if (response.ok)
                    onDelete();
            }}
            name="content"
            placeholder="Reply"
            allowEdit={user.id === reply.publisher.id}
        >
            <article
                dangerouslySetInnerHTML={{ __html: contentParsed }}
                className={styles.content}
            ></article>
        </EditableText> : <article
            dangerouslySetInnerHTML={{ __html: contentParsed }}
            className={styles.content}
        ></article>}
        <div
            className={styles.footer}
        >
            <span
                className={styles.repliesCount}
                onClick={(_) => setVisible(visible => !visible)}
            >
                <ReplyIcon /> {replies.length}
            </span>
            <Reactions
                post={reply}
            />
        </div>
        <div
            className={styles.replies}
        >
            {visible ? <>
                {user ? <form
                    action={dispatch}
                    className={styles.form}
                >
                    <TextField
                        name="content"
                        placeholder="Reply content"
                        errors={formState.content}
                        required={false}
                        inputRef={contentRef}
                    />
                    <button
                        className={styles.button}
                        type="submit"
                    >
                        Reply
                    </button>
                </form> : null}
                {replies.length ? <>
                    <span
                        className={styles.repliesHeader}
                    >
                        <h1>
                            Replies
                        </h1>
                        <span className={styles.order}>
                            <Select
                                name="order"
                                onChange={(event) => setOrder(event.target.value as Order)}
                            >
                                {orders.map(order =>
                                    <option
                                        key={order.value}
                                        value={order.value}
                                    >
                                        {order.name}
                                    </option>
                                )}
                            </Select>
                        </span>
                    </span>
                    <ul
                        className={styles.replyList}
                    >
                        {replies.map(reply_ =>
                            <Reply
                                key={reply_.id}
                                reply={reply_}
                                onDelete={() => {
                                    setReplies(replies => replies.filter(
                                        reply => reply.id !== reply_.id));
                                }}
                            />
                        )}
                    </ul>
                </>: null}
            </> : null}
        </div>
    </li>;
}
