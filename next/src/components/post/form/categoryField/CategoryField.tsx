'use client';

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    matchCategory
} from './actions';
import {
    debounce
} from '../../../../utils/functions';
import './style.css';

export default function CategoryField(
    {
        categories,
        setCategories,
        errors
    }: {
        categories: string[];
        setCategories: Dispatch<SetStateAction<string[]>>;
        errors?: string[];
    }
) {
    const inputRef = useRef<HTMLInputElement>(null);
    const datalistRef = useRef<HTMLDataListElement>(null);

    const categoryQuery = useRef('');
    const [matches, setMatches] = useState(new Array<string>());

    async function getMatches(
        query?: string
    ) {
        const match = new Set(await matchCategory(query));
        // @ts-ignore
        return [...match.difference(
            new Set(categories)
        )]
    }

    const handleSearch = debounce(
        async (
            query: string
        ): Promise<void> => {
            setMatches(await getMatches(query));
            categoryQuery.current = query;
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
        getMatches(categoryQuery.current).then(setMatches);
    }, [categories.length]);

    return <div className="field-wrapper">
        <label
            htmlFor="title"
        >
            Categories
        </label>
        <ul
            className="form-errors"
        >
            {errors?.map((error, key) =>
                <li
                    className="form-error"
                    key={key}
                >
                    {error}
                </li>
            )}
        </ul>
        <input
            className="field-input"
            type="text"
            id="categories"
            name="categories"
            placeholder="Start typing to get tooltips"
            onChange={(event) => {
                handleSearch(event.target.value);
            }}
            onKeyDown={(event) => {
                event.stopPropagation();
                switch (event.key) {
                    case 'Enter':
                        event.preventDefault();
                        if (matches.length) {
                            (event.target as HTMLInputElement).value = '';
                            categoryQuery.current = '';
                            setCategories(categories.concat(matches[0]));
                        }
                        break;
                    case 'Tab':
                        event.preventDefault();
                        if (matches.length) {
                            (event.target as HTMLInputElement).value = matches[0];
                            categoryQuery.current = matches[0];
                        }
                        break;
                }
            }}
            defaultValue={categoryQuery.current}
            ref={inputRef}
        />
        <datalist
            id="categories-match"
            ref={datalistRef}
        >
            {matches.map((match, key) =>
                <option
                    key={key}
                    value={match}
                    onClick={(_) => {
                        const input = inputRef.current as HTMLInputElement;
                        const nativeInputValueSetter = (Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype,
                            'value'
                        ) as PropertyDescriptor).set;
                        nativeInputValueSetter?.call(input, match);
                        const event = new Event('input', { bubbles: true });
                        input.dispatchEvent(event);
                    }}
                >
                    {match}
                </option>
            )}
        </datalist>
        <ul
            className="categories-list"
        >
            {categories.map((category, key) =>
                <li key={key}>
                    <span>
                        {category}
                    </span>
                    <span
                        style={{
                            marginLeft: 16,
                            color: 'red',
                            cursor: 'pointer'
                        }}
                        onClick={(_) => {
                            setCategories(categories.filter(cat => cat !== category));
                        }}
                    >
                        del
                    </span>
                </li>
            )}
        </ul>
    </div>;
}
