'use client';

import {
    formDataSerialize
} from '../../../utils/functions';
import {
    register
} from '../user/actions';
import {
    useFormState
} from 'react-dom';
import CharField from '../../../components/misc/form/CharField';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Register() {
    async function submit(
        _: any,
        formData: FormData
    ) {
        return await register(
            formDataSerialize(formData) as
                RegisterCredentials);
    }
    const [formState, setFormState] = useFormState(submit, {});

    return <form
        className={styles.form}
        action={setFormState}
    >
        <CharField
            name="username"
            type="text"
            placeholder="Username"
            label={true}
            errors={formState.username}
        />
        <CharField
            name="email"
            type="email"
            placeholder="Email address"
            label={true}
            errors={formState.email}
        />
        <CharField
            name="password"
            type="password"
            placeholder="Password"
            label={true}
            errors={formState.password}
        />
        <button
            className={styles.button}
            type="submit"
        >
            Register
        </button>
        <span
            className={styles.tooltip}
        >
            Already have an account? <Link
                className="link"
                href={'/user/login'}
            >
                Login
            </Link> instead.
        </span>
    </form>;
}
