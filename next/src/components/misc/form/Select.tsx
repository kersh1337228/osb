'use client';

import React, {
    ChangeEventHandler,
    HTMLAttributes,
    ReactElement,
    RefObject
} from 'react';
import styles from './styles.module.css';

export default function Select(
    {
        name,
        errors,
        label = false,
        required = true,
        defaultValue,
        inputRef,
        onChange,
        children
    }: {
        name: string;
        errors?: string[];
        label?: boolean;
        required?: boolean;
        defaultValue?: string;
        inputRef?: RefObject<HTMLSelectElement>;
        onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
        children: ReactElement<HTMLAttributes<HTMLOptionElement>>[];
    }
) {
    const replacement = React.Children.map(children, child => {
        // @ts-ignore
        return <li value={child.props.value}>
            {child.props.children}
        </li>;
    })
    // console.log(replacement);

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
        <select
            className={styles.select}
            id={name}
            name={name}
            defaultValue={defaultValue}
            required={required}
            ref={inputRef}
            onChange={onChange}
        >
            {children}
        </select>
        <ul>
            {/*{replacement}*/}
        </ul>
    </div>;
}
