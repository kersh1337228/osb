'use client';

import {
    HTTPRequestMethod
} from '../../../../utils/constants';
import styles from './styles.module.css';
import Editable from '../../../misc/editable/Editable';
import {
    useState
} from 'react';
import {
    serverRequest
} from '../../../../utils/actions';
import EditableCategory from '../../../misc/editable/EditableCategory';
import Link from 'next/link';

export default function CategoryListItem(
    {
        category,
        onChange
    }: {
        category: Category;
        onChange: (categories: Category[]) => void;
    }
) {
    const [title, setTitle] = useState(category.title);
    const params = new URLSearchParams();
    params.set('categories', JSON.stringify([category]));

    return <li
        className={styles.categoryListItem}
    >
        <span
            className={styles.category}
        >
            <span>
                <Editable
                    value={title}
                    setValue={async (title: string) => {
                        const response = await serverRequest(
                            `post/category/update/${category.id}`,
                            HTTPRequestMethod.PATCH,
                            { cache: 'no-store' },
                            { title }
                        );

                        if (response.ok)
                            setTitle(title);

                        return response;
                    }}
                    onDelete={async () => {
                        const response = await serverRequest(
                            `post/category/delete/${category.id}`,
                            HTTPRequestMethod.DELETE, {
                                cache: 'no-store'
                            }
                        );

                        if (response.ok)
                            onChange(response.data as Category[]);
                    }}
                    name="title"
                    type="text"
                    placeholder="Title"
                >
                    {title}
                </Editable>
                <Link
                    href={`/post?${params.toString()}`}
                    className={styles.link}
                >
                    Posts: {category.posts}
                </Link>
            </span>
            <EditableCategory
                value={category.parent_category}
                setValue={async (parent_category: number | null) => {
                    const response = await serverRequest(
                        `post/category/update/${category.id}`,
                        HTTPRequestMethod.PATCH, {
                            cache: 'no-store'
                        }, {
                            parent_category
                        }
                    );

                    if (response.ok)
                        onChange(response.data as Category[]);

                    return response;
                }}
                allowDelete={true}
                name="parent_category"
            >
                <i>Parent:</i>
                {category.parent_category ? category.parent_category.title : '-'}
            </EditableCategory>
        </span>
        {category.children.length ? <ul
            className={styles.children}
        >
            {category.children.map(child =>
                <CategoryListItem
                    key={child.id}
                    category={child}
                    onChange={onChange}
                />
            )}
        </ul> : null}
    </li>;
}
