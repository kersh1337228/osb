'use client';

import './form.css';
import {
    useState
} from 'react';
import {
    useFormState
} from 'react-dom';
import CategoryField from './categoryField/CategoryField';
import {
    createPost
} from './actions';
import CharField from './CharField';
import TextField from './TextField';

export default function EditForm() {
    const [categories, setCategories] = useState(new Array<string>());

    async function submit(
        prevState: Record<string, string[]>,
        formData: FormData
    ) {
        const response = await createPost(
            formData.get('title') as string,
            categories,
            formData.get('content') as string
        );
        return response;
    }

    const [formState, setFormState] = useFormState(submit, {});

    return <form
        className="light"
        action={setFormState}
    >
        <h1 className="section-header">Create new post</h1>
        <CharField
            name={'title'}
            placeholder={'Title'}
            errors={formState.title}
        />
        <CategoryField
            categories={categories}
            setCategories={setCategories}
            errors={formState.categories}
        />
        <TextField
            name={'content'}
            placeholder={'Textual content'}
            errors={formState.conent}
        />
        <button
            className="form-button"
            type="submit"
        >
            Submit
        </button>
    </form>;
}
