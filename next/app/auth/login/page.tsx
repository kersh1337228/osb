'use client';

import {
    formDataSerialize
} from '../../../src/utils/functions';
import {
    login,
    UserCredentials
} from '../../../src/actions/auth';
import CharField from '../../../src/components/post/form/CharField';
import PasswordField from '../../../src/components/post/form/PasswordField';
import {
    useFormState
} from 'react-dom';

export default function LoginPage() {
    async function submit(
        _: any,
        formData: FormData
    ) {
        return await login(
            formDataSerialize(formData) as UserCredentials);
    }
    const [formState, setFormState] = useFormState(submit, {});

    return <main className="fill">
        <form
            className="light"
            action={setFormState}
        >
            <CharField
                name={'username'}
                placeholder={'Username or Email address'}
                errors={formState.username}
            />
            <PasswordField
                name={'password'}
                placeholder={'Password'}
                errors={formState.password}
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
