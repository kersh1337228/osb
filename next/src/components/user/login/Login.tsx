'use client';

import {
    formDataSerialize
} from '../../../utils/functions';
import {
    login
} from '../user/actions';
import CharField from '../../../components/misc/form/CharField';
import {
    useFormState
} from 'react-dom';
import styles from './styles.module.css';
import Link from 'next/link';

export default function Login() {
    const [formState, setFormState] = useFormState(async (
        _: any,
        formData: FormData
    ) => {
        return await login(
            formDataSerialize(formData) as
                LoginCredentials);
    }, {});

    return <form
        className={styles.form}
        action={setFormState}
    >
        <CharField
            name="username"
            type="text"
            placeholder="Username or Email address"
            label={true}
            errors={formState.username}
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
            Login
        </button>
        <span
            className={styles.tooltip}
        >
            Don't have an account? <Link
                className="link"
                href={'/user/register'}
            >
                Register
            </Link> instead.
        </span>
    </form>;
}
