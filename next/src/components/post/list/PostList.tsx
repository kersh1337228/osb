'use client';

import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod,
    maxDate,
    minDate
} from '../../../utils/constants';
import PostListItem from './item/PostListItem';
import styles from './styles.module.css';
import Link from 'next/link';
import CategoryListField from '../../misc/form/CategoryListField';
import {
    useState,
    useEffect,
    useContext
} from 'react';
import {
    useSearchParams,
    usePathname,
    useRouter
} from 'next/navigation';
import {
    UserContext
} from '../../misc/providers/UserProvider';

export default function PostList(
    {
        postsInit
    }: {
        postsInit: PostPartial[];
    }
) {
    const user = useContext(UserContext);

    const [posts, setPosts] = useState(postsInit);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [title, setTitle] = useState(
        searchParams.get('title') ?? '');
    const [categories, setCategories] = useState(
        searchParams.has('categories') ? JSON.parse(
            searchParams.get('categories') as string
        ) as CategoryPartial[] : []
    );
    const [publishTimeStart, setPublishTimeStart] = useState(
        searchParams.get('publish_time__start') ?? minDate);
    const [publishTimeEnd, setPublishTimeEnd] = useState(
        searchParams.get('publish_time__end') ?? maxDate);
    const [updateTimeStart, setUpdateTimeStart] = useState(
        searchParams.get('update_time__start') ?? minDate);
    const [updateTimeEnd, setUpdateTimeEnd] = useState(
        searchParams.get('update_time__end') ?? maxDate);
    const [offset, setOffset] = useState(
        searchParams.has('offset') ? Number(searchParams.get('offset')) : 0);
    const [limit, setLimit] = useState(
        searchParams.has('limit') ? Number(searchParams.get('limit')) : 5);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set('title', title);
        params.set('categories', JSON.stringify(categories));
        params.set('publish_time__start', publishTimeStart);
        params.set('publish_time__end', publishTimeEnd);
        params.set('update_time__start', updateTimeStart);
        params.set('update_time__end', updateTimeEnd);
        params.set('offset', offset.toString());
        params.set('limit', limit.toString());
        replace(`${pathname}?${params.toString()}`);

        (async () => {
            const response = await serverRequest(
                'post/list',
                HTTPRequestMethod.POST, {
                    cache: 'no-store'
                }, {
                    title,
                    categories: categories.map(category => category.id),
                    publish_time__start: publishTimeStart,
                    publish_time__end: publishTimeEnd,
                    update_time__start: updateTimeStart,
                    update_time__end: updateTimeEnd,
                    offset,
                    limit
                }
            );

            if (response.ok)
                setPosts(response.data as PostPartial[]);
        })()
    }, [
        title, categories,
        publishTimeStart, publishTimeEnd,
        updateTimeStart, updateTimeEnd,
        offset, limit
    ]);

    useEffect(() => {
        if (searchParams.size === 1 && searchParams.has('categories'))
            setCategories(JSON.parse(
                searchParams.get('categories') as string
            ) as CategoryPartial[]);
    }, [searchParams.get('categories')]);

    return <main>
        <section
            className={styles.section}
        >
            <div
                className={styles.controls}
            >
                <Link
                    href={'post/create'}
                    className={styles.button}
                >
                    Add new post
                </Link>
                {user && user.is_superuser ? <Link
                    href={'post/category'}
                    className={styles.button}
                >
                    Mange categories
                </Link> : null}
            </div>
        </section>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                Post search
            </h1>
            <form
                className={styles.form}
            >
                <div
                    className={styles.titleField}
                >
                    <label
                        htmlFor="title"
                    >
                        Title
                    </label>
                    <input
                        type="search"
                        id="title"
                        name="title"
                        placeholder="Post title"
                        defaultValue={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <CategoryListField
                    categories={categories}
                    setCategories={setCategories}
                    label={true}
                    className={styles.categoriesField}
                />
                <fieldset
                    className={styles.publishTime}
                >
                    <legend>
                        Created
                    </legend>
                    <input
                        className={styles.left}
                        type="datetime-local"
                        id="publish_time__start"
                        name="publish_time__start"
                        placeholder="From"
                        defaultValue={publishTimeStart}
                        onChange={(event) => setPublishTimeStart(event.target.value)}
                    />
                    <input
                        className={styles.right}
                        type="datetime-local"
                        id="publish_time__end"
                        name="publish_time__end"
                        placeholder="To"
                        defaultValue={publishTimeEnd}
                        onChange={(event) => setPublishTimeEnd(event.target.value)}
                    />
                </fieldset>
                <fieldset
                    className={styles.updateTime}
                >
                    <legend>
                        Updated
                    </legend>
                    <input
                        className={styles.left}
                        type="datetime-local"
                        id="update_time__start"
                        name="update_time__start"
                        placeholder="From"
                        defaultValue={updateTimeStart}
                        onChange={(event) => setUpdateTimeStart(event.target.value)}
                    />
                    <input
                        className={styles.right}
                        type="datetime-local"
                        id="update_time__end"
                        name="update_time__end"
                        placeholder="To"
                        defaultValue={updateTimeEnd}
                        onChange={(event) => setUpdateTimeEnd(event.target.value)}
                    />
                </fieldset>
                <fieldset
                    className={styles.count}
                >
                    <legend>
                        Offset / Limit
                    </legend>
                    <input
                        className={styles.left}
                        type="number"
                        id="offset"
                        name="offset"
                        placeholder="Offset"
                        defaultValue={offset}
                        onChange={(event) => setOffset(event.target.valueAsNumber)}
                    />
                    <input
                        className={styles.right}
                        type="number"
                        id="limit"
                        name="limit"
                        placeholder="Limit"
                        defaultValue={limit}
                        onChange={(event) => setLimit(event.target.valueAsNumber)}
                    />
                </fieldset>
            </form>
            <ul>
                {posts.map(post =>
                    <PostListItem
                        post={post}
                        key={post.id}
                    />
                )}
            </ul>
        </section>
    </main>;
}
