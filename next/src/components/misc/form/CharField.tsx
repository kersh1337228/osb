import {
    HTMLInputTypeAttribute,
    RefObject
} from 'react';
import styles from './styles.module.css';

export default function CharField(
    {
        name,
        type,
        placeholder,
        errors,
        label = false,
        required = true,
        defaultValue,
        accept,
        inputRef
    }: {
        name: string;
        type:  HTMLInputTypeAttribute;
        placeholder: string;
        errors?: string[];
        label?: boolean;
        required?: boolean;
        defaultValue?: string | number;
        accept?: string;
        inputRef?: RefObject<HTMLInputElement>;
    }
) {
    return <div>
        {
            label ? <label
                htmlFor={name}
            >
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </label> : null
        }
        <ul>
            {errors?.map((error, key) =>
                <li
                    className={styles.error}
                    key={key}
                >
                    {error}
                </li>
            )}
        </ul>
        <input
            className={styles.input}
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            accept={accept}
            ref={inputRef}
        />
    </div>;
}
