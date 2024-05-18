'use client';

import React, {
    useRef,
    useState
} from 'react';
import EditIcon from '../../misc/icons/Edit';
import OKIcon from '../../misc/icons/OK';
import CancelIcon from '../../misc/icons/Cancel';
import CharField from './CharField';
import DeleteIcon from '../icons/Delete';
import styles from './styles.module.css';

export default function EditableImage(
    {
        value,
        setValue,
        name,
        placeholder,
        children
    }: {
        value: string | null;
        setValue: (value: File | null) => Promise<JSONResponse>;
        name: string;
        placeholder: string;
        children: React.ReactNode;
    }
) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState(new Array<string>());

    return edit ? <div
            className={styles.editableImage}
        >
            {children}
            <div
                className={styles.editableImageInner}
            >
                <CharField
                    name={name}
                    type="file"
                    placeholder={placeholder}
                    accept="image/*"
                    inputRef={inputRef}
                    errors={errors}
                />
                <OKIcon onClick={async (_) => {
                    const image = inputRef.current?.files?.item(0);
                    if (image) {
                        const response = await setValue(image);
                        if (!response.ok && name in response.data)
                            setErrors(response.data[name]);
                        else
                            setEdit(false);
                    } else
                        setErrors(['No image attached']);

                }}/>
                <CancelIcon onClick={(_) => {
                    setEdit(false);
                }}/>
            </div>
        </div>
        : <div
            className={styles.editableImage}
        >
            {children}
            <div
                className={styles.editableImageInner}
            >
                <EditIcon
                    onClick={(_) => {
                        setEdit(true);
                    }}
                />
                {value ? <DeleteIcon onClick={async (_) => {
                    await setValue(null);
                }}/> : null}
            </div>
        </div>;
}
