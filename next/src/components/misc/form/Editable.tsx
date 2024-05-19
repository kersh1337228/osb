'use client';

import React, {
    HTMLInputTypeAttribute,
    useRef,
    useState
} from 'react';
import EditIcon from '../../misc/icons/Edit';
import OKIcon from '../../misc/icons/OK';
import CancelIcon from '../../misc/icons/Cancel';
import CharField from './CharField';
import TextField from './TextField';
import styles from './styles.module.css';
import DeleteIcon from '../icons/Delete';

export default function Editable(
    {
        value,
        setValue,
        name,
        type,
        placeholder,
        children,
        component = CharField,
        onDelete
    }: {
        value: any;
        setValue: (value: any) => Promise<JSONResponse>;
        onDelete?: () => Promise<void>;
        name: string;
        type:  HTMLInputTypeAttribute;
        component?: typeof CharField | typeof TextField;
        placeholder: string;
        children: React.ReactNode;
    }
) {
    onDelete = onDelete ?? (async () => {
        await setValue(null);
    });

    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState(new Array<string>());

    return edit ? <div
        className={styles.editable}
    >
        {React.createElement(
            // @ts-ignore
            component,
            {
                name,
                type,
                placeholder,
                defaultValue: value,
                inputRef,
                errors
            }
        )}
        <OKIcon onClick={async (_) => {
            const response = await setValue(inputRef.current?.value);
            if (!response.ok && name in response.data)
                setErrors(response.data[name]);
            else
                setEdit(false);
        }} />
        <CancelIcon onClick={(_) => {
            setEdit(false);
        }} />
    </div> : <div
        className={styles.editable}
    >
        {children}
        <EditIcon
            onClick={(_) => {
                setEdit(true);
            }}
        />
        {value ? <DeleteIcon
            onClick={onDelete}
        /> : null}
    </div>;
}
