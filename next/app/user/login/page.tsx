'use client';

import {
    formDataSerialize
} from '../../../src/utils/functions';
import {
    login
} from '../../../src/actions/auth';
import CharField from '../../../src/components/misc/form/CharField';
import {
    useFormState
} from 'react-dom';

export default function LoginPage() {
    async function submit(
        _: any,
        formData: FormData
    ) {
        return await login(
            formDataSerialize(formData) as
                LoginCredentials);
    }
    const [formState, setFormState] = useFormState(submit, {});

    return <main className="fill">
        <form
            className="light"
            action={setFormState}
        >
            <CharField
                name="username"
                type="text"
                placeholder="Username or Email address"
                errors={formState.username}
            />
            <CharField
                name="password"
                type="password"
                placeholder="Password"
                errors={formState.username}
            />
            <button
                className="form-button"
                type="submit"
            >
                Login
            </button>
        </form>;
    </main>;
}
