'use client';

import React, {
    Dispatch,
    SetStateAction,
    useState
} from 'react';
import EditIcon from '../icons/Edit';
import OKIcon from '../icons/OK';
import CancelIcon from '../icons/Cancel';
import CategoryListField from '../form/CategoryListField';
import styles from './styles.module.css';
import CategoryField from '../form/CategoryField';
import DeleteIcon from '../icons/Delete';

export default function EditableCategory(
    {
        value,
        setValue,
        name = 'category',
        children,
        onDelete,
        allowDelete = false,
        allowEdit = true,
    }: {
        value: CategoryPartial | null;
        setValue: (category: number | null) => Promise<JSONResponse>;
        name?: string;
        children: React.ReactNode;
        onDelete?: () => Promise<void>;
        allowDelete?: boolean | null;
        allowEdit?: boolean | null;
    }
) {
    const [category, setCategory] = useState(value);
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState(new Array<string>());

    return edit ? <div
        className={styles.editableRow}
    >
        <CategoryField
            category={category ?? undefined}
            setCategory={setCategory}
            errors={errors}
        />
        <span
            className={styles.row}
        >
            <OKIcon onClick={async (_) => {
                const response = await setValue(category ? category.id : null);
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
