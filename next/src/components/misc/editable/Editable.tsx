'use client';

import React, {
    HTMLInputTypeAttribute,
    useRef,
    useState
} from 'react';
import EditIcon from '../icons/Edit';
import OKIcon from '../icons/OK';
import CancelIcon from '../icons/Cancel';
import CharField from '../form/CharField';
import DeleteIcon from '../icons/Delete';
import styles from './styles.module.css';

export default function Editable(
    {
        value,
        setValue,
        name,
        type,
        placeholder,
        children,
        onDelete,
        allowDelete = false,
        allowEdit = true
    }: {
        value: any;
        setValue: (value: any) => Promise<JSONResponse>;
        onDelete?: () => Promise<void>;
        allowDelete?: boolean | null;
        allowEdit?: boolean | null;
        name: string;
        type:  HTMLInputTypeAttribute;
        placeholder: string;
        children: React.ReactNode;
    }
) {
    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState(new Array<string>());

    return edit ? <div
        className={styles.editableRow}
    >
        <CharField
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={value}
            inputRef={inputRef}
            errors={errors}
        />
        <span
            className={styles.row}
        >
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
        </span>
    </div> : <div
        className={styles.editableRow}
    >
        {children}
        <span
            className={styles.row}
        >
            {allowEdit ? <EditIcon
                onClick={(_) => {
                    setEdit(true);
                }}
            /> : null}
            {value && (onDelete || allowDelete) ? <DeleteIcon
                onDoubleClick={onDelete ?? (allowDelete ?
                    async () => await setValue(null) : undefined)}
            /> : null}
        </span>
    </div>;
}
