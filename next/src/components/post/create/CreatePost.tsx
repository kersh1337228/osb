'use client';

import {
    useState
} from 'react';
import {
    serverRequest
} from '../../../actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';
import {
    useFormState
} from 'react-dom';
import CharField from '../../misc/form/CharField';
import CategoryField from '../../misc/form/CategoryField';
import TextField from '../../misc/form/TextField';
import styles from './styles.module.css';

export default async function CreatePost() {
    const [categories, setCategories] = useState(new Array<CategoryPartial>());

    async function submit(
        _: Record<string, string[]>,
        formData: FormData
    ) {
        return (await serverRequest(
            `${serverURL}/post/create`,
            HTTPRequestMethod.POST,
            {
                cache: 'force-cache'
            },
            {
                title: formData.get('title'),
                categories: categories.map(category => category.id),
                content: formData.get('content')
            }
        )).data;
    }

    const [formState, setFormState] = useFormState(submit, {});

    return <main>
        <h1
            className={styles.header}
        >
            Create new post
        </h1>
        <form
            className={styles.form}
            action={setFormState}
        >
            <CharField
                name="title"
                type="text"
                placeholder="Title"
                errors={formState.title}
            />
            <CategoryField
                categories={categories}
                setCategories={setCategories}
                errors={formState.categories}
            />
            <TextField
                name="content"
                placeholder="Textual content"
                errors={formState.conent}
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
