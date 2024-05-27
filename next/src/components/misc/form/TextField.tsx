'use client';

import {
    createRef,
    RefObject,
    useEffect
} from 'react';
import styles from './styles.module.css';

export default function TextField(
    {
        name,
        placeholder,
        errors,
        label = false,
        required = true,
        defaultValue,
        inputRef
    }: {
        name: string;
        placeholder: string;
        errors?: string[];
        label?: boolean;
        required?: boolean;
        defaultValue?: string;
        inputRef?: RefObject<HTMLTextAreaElement>;
    }
) {
    const contentRef = inputRef ?? createRef<HTMLTextAreaElement>();

    useEffect(() => {
        contentRef.current?.dispatchEvent(
            new Event('input', { bubbles: true }));
    }, []);

    return <div
        className={styles.field}
    >
        {
            label ? <label
                htmlFor={name}
            >
                {name.charAt(0).toUpperCase() + name.slice(1)}
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
        <textarea
            ref={contentRef}
            className={styles.input}
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
            onInput={(event) => {
                const target = event.target as HTMLTextAreaElement;
                target.style.height = '0';
                target.style.height = `${target.scrollHeight}px`;
            }}
            defaultValue={defaultValue}
        >
        </textarea>
    </div>;
}
