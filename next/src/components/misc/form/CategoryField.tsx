'use client';

import {
    Dispatch,
    RefObject,
    SetStateAction,
    createRef,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    debounce
} from '../../../utils/functions';
import styles from './styles.module.css';
import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';

export default function CategoryField(
    {
        category,
        setCategory,
        label = '',
        errors,
        className,
        inputRef
    }: {
        category?: CategoryPartial;
        setCategory: Dispatch<SetStateAction<CategoryPartial | null>>;
        label?: string;
        errors?: string[];
        className?: string;
        inputRef?: RefObject<HTMLInputElement>;
    }
) {
    inputRef = inputRef ?? createRef<HTMLInputElement>();
    const datalistRef = useRef<HTMLDataListElement>(null);

    const categoryTitle = useRef(category ? category.title : '');
    const [matches, setMatches] = useState(new Array<CategoryPartial>());

    const handleSearch = debounce(
        async (
            title: string
        ): Promise<void> => {
            const matches = title ? (await serverRequest(
                `${serverURL}/post/category/list`,
                HTTPRequestMethod.POST, {
                    cache: 'no-store'
                }, {
                    title
                }
            )).data as CategoryPartial[] : [];
            setMatches(matches);

            setCategory(matches.find(
                match => match.title === title) ?? null);
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

    return <div
        className={className ?? styles.field}
    >
        {
            label ? <label
                htmlFor="category"
            >
                {label}
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
            id="category"
            name="category"
            placeholder="Start typing to get tooltips"
            onChange={(event) => {
                handleSearch(event.target.value);
            }}
            onKeyDown={(event) => {
                event.stopPropagation();
                if (matches.length && event.key === 'Tab') {
                    event.preventDefault();
                    (event.target as HTMLInputElement).value = matches[0].title;
                    categoryTitle.current = matches[0].title;
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
    </div>;
}
