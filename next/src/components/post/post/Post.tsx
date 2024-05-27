'use client';

import {
    dateTimeFormat,
    HTTPRequestMethod,
    orders,
    serverURL
} from '../../../utils/constants';
import {
    Dispatch,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    serverRequest
} from '../../../utils/actions';
import TextField from '../../misc/form/TextField';
import styles from './styles.module.css';
import CommentIcon from '../../misc/icons/Comment';
import Comment from '../comment/Comment';
import Reactions from '../reaction/Reactions';
import Publisher from '../../user/publisher/Publisher';
import Select from '../../misc/form/Select';
import {
    UserContext
} from '../../misc/providers/UserProvider';
import {
    useFormState
} from 'react-dom';
import {
    ratingOrder,
    timeOrder
} from '../../../utils/functions';
import EditableText from '../../misc/editable/EditableText';
import {
    deletePost
} from './actions';
import Link from 'next/link';
import Editable from '../../misc/editable/Editable';
import EditableCategories from '../../misc/editable/EditableCategories';

export default function Post(
    {
        post
    }: {
        post: Post;
    }
) {
    const user = useContext(UserContext);

    const [title, setTitle] = useState(post.title);
    const [categories, setCategories] = useState(post.categories);
    const [content, setContent] = useState(post.content);

    const [comments, setComments] = useState(post.comments);
    const [visible, setVisible] = useState(false);
    const [order, setOrder] = useState<Order>('best');

    function setValue(
        name: string,
        dispatch: Dispatch<any>
    ) {
        return async (value: string | number[]) => {
            const response = await serverRequest(
                `${serverURL}/post/update/${post.id}`,
                HTTPRequestMethod.PATCH,
                { cache: 'no-store' },
                { [name]: value }
            );

            if (response.ok)
                dispatch(response.data[name]);

            return response;
        }
    }

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [formState, dispatch] = useFormState(async (
        _: Record<string, string[]>,
        formData: FormData
    ) => {
        const response = await serverRequest(
            `${serverURL}/post/comment/create`,
            HTTPRequestMethod.POST,
            { cache: 'no-store' },
            {
                commented_post: post.id,
                content: formData.get('content')
            }
        );
        if (response.ok) {
            setComments(comments => comments
                .concat(response.data as PostComment));
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
                setComments(comments => comments
                    .toSorted(ratingOrder));
                break;
            case 'new':
                setComments(comments => comments
                    .toSorted(timeOrder));
                break;
            case 'old':
                setComments(comments => comments
                    .toSorted((a, b) => -timeOrder(a, b)));
                break;
            case 'worst':
                setComments(comments => comments
                    .toSorted((a, b) => -ratingOrder(a, b)));
                break;
        }
    }, [order, comments.length]);

    return <main
        className={styles.postPage}
    >
        <section
            className={styles.header}
        >
            <span>
                <Publisher
                    user={post.publisher}
                />
                <Editable
                    value={title}
                    setValue={setValue('title', setTitle)}
                    allowEdit={user && user.id === post.publisher.id}
                    name="title"
                    type="text"
                    placeholder="Title"
                >
                    <h1
                        className={styles.title}
                    >
                        {title}
                    </h1>
                </Editable>
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
        </section>
        <section
            className={styles.categories}
        >
            <EditableCategories
                categories={categories}
                setCategories={setCategories}
                setValue={setValue('categories', setCategories)}
            >
                <ul>
                    {categories.map(category => {
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
            </EditableCategories>
        </section>
        <section
            className={styles.content}
        >
            {user && (user.id === post.publisher.id || user.is_superuser) ? <EditableText
                value={content}
                setValue={setValue('content', setContent)}
                onDelete={async () => await deletePost(post.id)}
                name="content"
                placeholder="Post HTML"
                allowEdit={user.id === post.publisher.id}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    className={styles.markdown}
                ></div>
            </EditableText> : <div
                dangerouslySetInnerHTML={{ __html: content }}
                className={styles.markdown}
            ></div>}
        </section>
        <div
            className={styles.footer}
        >
            <span
                className={styles.commentsCount}
                onClick={(_) => setVisible(visible => !visible)}
            >
                <CommentIcon/> {comments.length}
            </span>
            <Reactions
                post={post}
            />
        </div>
        <div
            className={styles.comments}
        >
            {visible ? <>
                {user ? <form
                    action={dispatch}
                    className={styles.form}
                >
                    <TextField
                        name="content"
                        placeholder="Comment HTML"
                        errors={formState.content}
                        required={false}
                        inputRef={contentRef}
                    />
                    <button
                        className={styles.button}
                        type="submit"
                    >
                        Comment
                    </button>
                </form> : null}
                {comments.length ? <>
                    <span
                        className={styles.commentsHeader}
                    >
                        <h1>
                            Comments
                        </h1>
                        <span>
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
                        className={styles.commentList}
                    >
                        {comments.map(comment_ =>
                            <Comment
                                key={comment_.id}
                                comment={comment_}
                                onDelete={() => {
                                    setComments(comments => comments.filter(
                                        comment => comment.id !== comment_.id));
                                }}
                            />
                        )}
                    </ul>
                </> : null}
            </> : null}
        </div>
    </main>;
}
