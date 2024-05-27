import Login from '../../../src/components/user/login/Login';
import {
    Metadata
} from 'next';

export const metadata: Metadata = {
    title: 'Login'
};


export default function LoginPage() {
    return <main>
        <Login />
    </main>;
}
