'use client';

import {
    useState
} from 'react';
import {
    useFormState
} from 'react-dom';
import CharField from '../../misc/form/CharField';
import CategoryListField from '../../misc/form/CategoryListField';
import TextField from '../../misc/form/TextField';
import styles from './styles.module.css';
import {
    createPost
} from './actions';

export default function PostCreate() {
    const [categories, setCategories] = useState(new Array<CategoryPartial>());

    const [formState, setFormState] = useFormState(async (
        _: Record<string, string[]>,
        formData: FormData
    ) => await createPost(
        formData.get('title') as string,
        categories.map(category => category.id),
        formData.get('content') as string
    ), {});

    return <main
        className={styles.main}
    >
        <h1
            className={styles.header}
        >
            New post
        </h1>
        <form
            className={styles.form}
            action={setFormState}
        >
            <CharField
                name="title"
                type="text"
                placeholder="Short title"
                label={true}
                errors={formState.title}
            />
            <CategoryListField
                categories={categories}
                setCategories={setCategories}
                label={true}
                errors={formState.categories}
            />
            <TextField
                name="content"
                placeholder="HTML markdown"
                label={true}
                errors={formState.content}
            />
            <button
                className={styles.button}
                type="submit"
            >
                Create
            </button>
        </form>
    </main>;
}
