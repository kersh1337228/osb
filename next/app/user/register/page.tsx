'use client';

import {
    formDataSerialize
} from '../../../src/utils/functions';
import {
    register
} from '../../../src/actions/auth';
import {
    useFormState
} from 'react-dom';
import CharField from '../../../src/components/misc/form/CharField';
import Link from 'next/link';

export default function RegisterPage(): React.ReactNode {
    async function submit(
        _: any,
        formData: FormData
    ) {
        return await register(
            formDataSerialize(formData) as
                RegisterCredentials);
    }
    const [formState, setFormState] = useFormState(submit, {});

    return <main
        className="fill"
    >
        <form
            className="light"
            action={setFormState}
        >
            <CharField
                name="username"
                type="text"
                placeholder="Username"
                errors={formState.username}
            />
            <CharField
                name="email"
                type="email"
                placeholder="Email address"
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
                Register
            </button>
            <span
                className="font-small"
            >
                 Already have an account? <Link
                    className="link"
                    href={'/user/login'}
                >
                    Login
                </Link> instead.
            </span>
        </form>
    </main>;
}
