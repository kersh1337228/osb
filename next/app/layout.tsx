import React from 'react';
import {
    Metadata
} from 'next';
import Header from '../src/components/root/header/Header';
import Footer from '../src/components/root/footer/Footer';
import {
    authenticate
} from '../src/components/user/user/actions';
import UserProvider from '../src/components/misc/providers/UserProvider';
import localFont from 'next/font/local';
import './global.css';


const SFProDisplay = localFont({
    src: [{
        path: '../public/fonts/sf/SF-Pro-Display-Black.otf',
        weight: '900'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Heavy.otf',
        weight: '800'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Bold.otf',
        weight: '700'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Semibold.otf',
        weight: '600'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Medium.otf',
        weight: '500'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Regular.otf',
        weight: '400'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Thin.otf',
        weight: '300'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Light.otf',
        weight: '200'
    }, {
        path: '../public/fonts/sf/SF-Pro-Display-Ultralight.otf',
        weight: '100'
    }],
    variable: '--sf'
});

const ComputerModern = localFont({
    src: [{
        path: '../public/fonts/cm/cmunbi.ttf',
        weight: '600 900',
        style: 'italic'
    }, {
        path: '../public/fonts/cm/cmunbx.ttf',
        weight: '600 900',
        style: 'normal'
    }, {
        path: '../public/fonts/cm/cmunrm.ttf',
        weight: '100 500',
        style: 'normal'
    }, {
        path: '../public/fonts/cm/cmunti.ttf',
        weight: '100 500',
        style: 'italic'
    }],
    variable: '--cm'
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: {
        template: '%s',
        default: 'OSB',
    },
    description: 'Posts about free open-source software and hardware.'
};

export default async function RootLayout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {
    const user = await authenticate();

    return (
        <html
            lang='en'
        >
            <body
                className={`${SFProDisplay.variable} ${ComputerModern.variable}`}
            >
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
