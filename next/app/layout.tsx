import Header from '../src/components/root/header/Header';
import Footer from '../src/components/root/footer/Footer';
import {
    authenticate
} from '../src/actions/auth';
import './global.css';

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
                <Header user={user} />
                {children}
                <Footer />
            </body>
        </html>
    );
}
