'use client';

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    debounce
} from '../../../utils/functions';
import styles from './styles.module.css';
import { serverRequest } from '../../../utils/actions';
import { HTTPRequestMethod, serverURL } from '../../../utils/constants';
import CancelIcon from '../icons/Cancel';

export default function CategoryListField(
    {
        categories,
        setCategories,
        label = false,
        errors,
        className
    }: {
        categories: CategoryPartial[];
        setCategories: Dispatch<SetStateAction<CategoryPartial[]>>;
        label?: boolean;
        errors?: string[];
        className?: string;
    }
) {
    const inputRef = useRef<HTMLInputElement>(null);
    const datalistRef = useRef<HTMLDataListElement>(null);

    const categoryTitle = useRef('');
    const [matches, setMatches] = useState(new Array<CategoryPartial>());

    async function getMatches(
        title?: string
    ) {
        if (title) {
            const response = (await serverRequest(
                `${serverURL}/post/category/list`,
                HTTPRequestMethod.POST, {
                    cache: 'no-store'
                }, {
                    title
                }
            )).data as CategoryPartial[];

            return response.filter(
                match => !categories.some(
                    category => category.id === match.id));
        }

        return [];
    }

    const handleSearch = debounce(
        async (
            title: string
        ): Promise<void> => {
            await getMatches(title).then(setMatches)
            categoryTitle.current = title;
        }, 300
    );

    useEffect(() => {
        const input = inputRef.current as HTMLInputElement;
        const dataList = datalistRef.current as HTMLDataListElement;

        if (matches.length) {
            dataList.style.display = 'block';
            input.style.borderBottom = 'none';
            input.style.borderRadius = '7px 7px 0 0';
        } else {
            dataList.style.display = 'none';
            input.style.borderBottom = '';
            input.style.borderRadius = '7px';
        }
    }, [matches.length]);

    useEffect(() => {
        getMatches(categoryTitle.current).then(setMatches);
    }, [categories.length]);

    return <div
        className={className ?? styles.field}
    >
        {
            label ? <label
                htmlFor="categories"
            >
                Categories
            </label> : null
        }
        <ul
            className={styles.errors}
        >
            {errors?.map((error, key) =>
                <li
                    key={key}
                >
                    {error}
                </li>
            )}
        </ul>
        <input
            className={styles.input}
            type="search"
            id="categories"
            name="categories"
            placeholder="Start typing to get tooltips"
            onChange={(event) => {
                handleSearch(event.target.value);
            }}
            onKeyDown={(event) => {
                event.stopPropagation();
                if (matches.length) {
                    switch (event.key) {
                        case 'Enter':
                            event.preventDefault();
                            (event.target as HTMLInputElement).value = '';
                            categoryTitle.current = '';
                            setCategories(categories => categories.concat(matches[0]));
                            break;
                        case 'Tab':
                            event.preventDefault();
                            (event.target as HTMLInputElement).value = matches[0].title;
                            categoryTitle.current = matches[0].title;
                            break;
                    }
                }
            }}
            defaultValue={categoryTitle.current}
            ref={inputRef}
        />
        <datalist
            className={styles.datalist}
            id="categories-match"
            ref={datalistRef}
        >
            {matches.map(match =>
                <option
                    key={match.id}
                    value={match.title}
                    onClick={(_) => {
                        const input = inputRef.current as HTMLInputElement;
                        const nativeInputValueSetter = (Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype,
                            'value'
                        ) as PropertyDescriptor).set;
                        nativeInputValueSetter?.call(input, match.title);
                        const event = new Event('input', { bubbles: true });
                        input.dispatchEvent(event);
                    }}
                >
                    {match.title}
                </option>
            )}
        </datalist>
        <ul
            className={styles.categories}
        >
            {categories.map(category =>
                <li
                    key={category.id}
                    className={styles.category}
                >
                    <span>
                        {category.title}
                    </span>
                    <CancelIcon
                        onClick={(_) => {
                            setCategories(categories => categories.filter(
                                cat => cat.id !== category.id));
                        }}
                    />
                </li>
            )}
        </ul>
    </div>;
}
