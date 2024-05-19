import Header from '../src/components/root/header/Header';
import Footer from '../src/components/root/footer/Footer';
import {
    authenticate
} from '../src/actions/auth';
import './global.css';
import UserProvider from '../src/components/misc/providers/UserProvider';

export default async function RootLayout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {
    const user = await authenticate();

    return (
        <html lang='en'>
            <body>
                <UserProvider
                    user={user}
                >
                    <Header />
                    {children}
                    <Footer />
                </UserProvider>
            </body>
        </html>
    );
}
