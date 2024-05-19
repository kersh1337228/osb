'use client';

import {
    dateTimeFormat, HTTPRequestMethod, serverURL
} from '../../../utils/constants';
import styles from './styles.module.css';
import Reactions from '../reaction/Reactions';
import Publisher from '../../user/publisher/Publisher';
import ReplyIcon from '../../misc/icons/Reply';
import TextField from '../../misc/form/TextField';
import {
    useContext,
    useRef,
    useState
} from 'react';
import {
    useFormState
} from 'react-dom';
import {
    serverRequest
} from '../../../actions/request';
import {
    ratingOrder,
    timeOrder
} from '../../../utils/functions';
import Editable from '../../misc/form/Editable';
import {
    UserContext
} from '../../misc/providers/UserProvider';
import Select from '../../misc/form/Select';

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

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [formState, dispatch] = useFormState(async (
        _: Record<string, string[]>,
        formData: FormData
    ) => {
        const response = await serverRequest(
            `${serverURL}/post/reply/create`,
            HTTPRequestMethod.POST,
            { cache: 'no-store' },
            {
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
        {user && user.id === reply.publisher.id ? <Editable
            value={content}
            setValue={async (content: string) => {
                const response = await serverRequest(
                    `${serverURL}/post/reply/update/${reply.id}`,
                    HTTPRequestMethod.PATCH,
                    { cache: 'no-store' },
                    { content }
                );

                if (response.ok)
                    setContent(content);

                return response;
            }}
            onDelete={async () => {
                const response = await serverRequest(
                    `${serverURL}/post/reply/delete/${reply.id}`,
                    HTTPRequestMethod.DELETE,
                    { cache: 'no-store' }
                );

                if (response.ok)
                    onDelete();
            }}
            name="content"
            type="text"
            placeholder="Reply"
            component={TextField}
        >
            <p
                className={styles.content}
            >
                {content}
            </p>
        </Editable> : <p
            className={styles.content}
        >
            {content}
        </p>}
        <div
            className={styles.footer}
        >
            <span
                className={styles.repliesCount}
            >
                <ReplyIcon
                    onClick={(_) => setVisible(visible => !visible)}
                /> {reply.replies.length}
                {/*TODO: ordering using custom select*/}
                <Select
                    name="order"
                    onChange={(event) => {
                        switch (event.target.value) {
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
                    }}
                >
                    <option
                        value="best"
                    >
                        Best
                    </option>
                    <option
                        value="new"
                    >
                        New
                    </option>
                    <option
                        value="old"
                    >
                        Old
                    </option>
                    <option
                        value="worst"
                    >
                        Worst
                    </option>
                </Select>
            </span>
            <Reactions
                // TODO: resort on reaction
                reactions={reply.reactions}
                reacted_to={reply.id}
            />
        </div>
        {visible ? <div>
            <form
                action={dispatch}
                className={styles.form}
            >
                <TextField
                    name="content"
                    placeholder="Reply"
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
            </form>
            <ul
                className={styles.replies}
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
        </div> : null}
    </li>;
}
