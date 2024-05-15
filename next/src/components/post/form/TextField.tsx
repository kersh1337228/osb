'use client';

import {
    useEffect,
    useRef
} from 'react';

export default function TextField(
    {
        name,
        placeholder,
        errors
    }: {
        name: string;
        placeholder: string;
        errors?: string[]
    }
) {
    const contentRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        contentRef.current?.dispatchEvent(
            new Event('input', { bubbles: true }));
    }, []);

    const verbose = name.charAt(0).toUpperCase() + name.slice(1);

    return <div>
        <label
            htmlFor="content"
        >
            {verbose}
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
        <textarea
            ref={contentRef}
            className="field-input"
            id={name}
            name={name}
            placeholder={placeholder}
            required
            onInput={(event) => {
                const t = event.target as HTMLTextAreaElement;
                t.style.height = '0';
                t.style.height = `${t.scrollHeight}px`;
            }}
        >
        </textarea>
    </div>;
}
