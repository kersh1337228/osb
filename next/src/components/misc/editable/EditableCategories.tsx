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

export default function EditableCategories(
    {
        categories,
        setCategories,
        setValue,
        allowEdit,
        children
    }: {
        categories: CategoryPartial[];
        setCategories: Dispatch<SetStateAction<CategoryPartial[]>>;
        setValue: (categories: number[]) => Promise<JSONResponse>;
        allowEdit?: boolean | null;
        children: React.ReactNode;
    }
) {
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState(new Array<string>());

    return edit ? <div
        className={styles.editableRow}
    >
        <CategoryListField
            categories={categories}
            setCategories={setCategories}
            errors={errors}
        />
        <span
            className={styles.row}
        >
            <OKIcon onClick={async (_) => {
                const response = await setValue(
                    categories.map(category => category.id));
                if (!response.ok && 'categories' in response.data)
                    setErrors(response.data.categories);
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
        </span>
    </div>;
}
