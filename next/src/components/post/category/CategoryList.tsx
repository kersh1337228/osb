'use client';

import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod
} from '../../../utils/constants';
import {
    useState,
    useRef
} from 'react';
import {
    useFormState
} from 'react-dom';
import styles from './styles.module.css';
import CategoryListItem from './item/CategoryListItem';
import CharField from '../../misc/form/CharField';
import CategoryField from '../../misc/form/CategoryField';
import {
    debounce
} from '../../../utils/functions';

export default function CategoryList(
    {
        categoriesInit
    }: {
        categoriesInit: Category[];
    }
) {
    const [categories, setCategories] = useState(categoriesInit);
    const [parentCategory, setParentCategory] = useState<CategoryPartial | null>(null);
    const [matches, setMatches] = useState<Category[]>([]);

    const handleSearch = debounce(
        async (
            title: string
        ): Promise<void> => {
            setMatches(title ? (await serverRequest(
                'post/category',
                HTTPRequestMethod.POST, {
                    cache: 'no-store'
                }, {
                    title
                }
            )).data as Category[] : []);
        }, 300
    );

    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);

    const [formState, dispatch] = useFormState(async (
        _: Record<string, string[]>,
        formData: FormData
    ) => {
        const response = await serverRequest(
            'post/category/create',
            HTTPRequestMethod.POST, {
                cache: 'no-store'
            }, {
                title: formData.get('title'),
                parent_category: parentCategory?.id
            }
        );
        if (response.ok) {
            setCategories(response.data as Category[]);
            // @ts-ignore
            titleRef.current.value = '';
            // @ts-ignore
            categoryRef.current.value = '';
            setParentCategory(null);
            return {};
        } else
            return response.data;
    }, {});

    return <main>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                Create category
            </h1>
            <form
                action={dispatch}
                className={styles.form}
            >
                <CharField
                    name="title"
                    type="text"
                    placeholder="Category title"
                    errors={formState.title}
                    inputRef={titleRef}
                />
                <CategoryField
                    setCategory={setParentCategory}
                    label="Parent category"
                    inputRef={categoryRef}
                />
                <button
                    type="submit"
                    className={styles.button}
                >
                    Create
                </button>
            </form>
        </section>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                Categories
            </h1>
            <input
                className={styles.input}
                type="search"
                id="title"
                name="title"
                placeholder="Categories search"
                onChange={(event) => {
                    handleSearch(event.target.value);
                }}
            />
            <ul>
                {matches.length ? matches.map(match =>
                    // <CategoryMatch
                    //     category={match}
                    //     onDelete={() => {
                    //         setCategories(categories => categories.filter(
                    //             category => category.id !== match.id));
                    //     }}
                    // />
                    <CategoryListItem
                        key={match.id}
                        category={match}
                        onChange={setCategories}
                    />
                ) : categories.map(category_ =>
                    <CategoryListItem
                        key={category_.id}
                        category={category_}
                        onChange={setCategories}
                    />
                )}
            </ul>
        </section>
    </main>;
}
