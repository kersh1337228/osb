'use client';

import {
    formDataSerialize
} from '../../../src/utils/functions';
import {
    login,
    UserCredentials
} from '../../../src/actions/auth';

export default function LoginPage(): React.ReactNode {
    async function submit(
        formData: FormData
    ) {
        const r = await login(
            formDataSerialize(formData) as UserCredentials);
    }

    return <main>
        <form
            method={'post'}
            encType={'multipart/form-data'}
            action={submit}
        >
            <input
                name={'username'}
                type={'text'}
                placeholder={'Username or Email address'}
                required={true}
            />
            <input
                name={'password'}
                type={'password'}
                placeholder={'Password'}
                required={true}
            />
            <button>Login</button>
        </form>
    </main>;
}
