import Header from '../src/components/general/header/Header';
import Footer from '../src/components/general/footer/Footer';
import './global.css';

export default function RootLayout(
    { children }: { children: React.ReactNode }
): React.ReactNode {
    return (
        <html lang='en'>
            <body>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
