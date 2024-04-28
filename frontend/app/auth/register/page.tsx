'use client';

import {
    formDataSerialize
} from '../../../src/utils/functions';
import {
    register,
    UserCredentials
} from '../../../src/actions/auth';

export default function LoginPage(): React.ReactNode {

    async function submit(
        formData: FormData
    ) {
        const r = await register(
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
                placeholder={'Username'}
                required={true}
            />
            <input
                name={'email'}
                type={'email'}
                placeholder={'Email address'}
                required={true}
            />
            <input
                name={'password'}
                type={'password'}
                placeholder={'Password'}
                required={true}
            />
            <button>Register</button>
        </form>
    </main>;
}
