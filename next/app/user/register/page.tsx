import {
    Metadata
} from 'next';
import Register from '../../../src/components/user/register/Register';

export const metadata: Metadata = {
    title: 'Register'
};

export default async function RegisterPage() {
    return <main>
        <Register />
    </main>;
}
