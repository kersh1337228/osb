'use client';

import GlobalNav, {
    NavElement
} from './GlobalNav';
import UserIcon from '../icons/UserIcon';
import Link from 'next/link';
import './header.css';
import {
    usePathname
} from 'next/navigation';
import Menu from './Menu';

const mainMenu = [
    {
        name: 'Posts',
        href: '/post',
        icon: null
    }, {
        name: 'About',
        href: '/about',
        icon: null
    }, {
        name: 'User',
        href: '/user',
        icon: <UserIcon/>
    }
] as NavElement[];

export default function Header(): React.ReactNode {
    const path = usePathname();

    return <header>
        <div className="container">
            <div className="header-inner">
                {path === '/' ?
                    <div className="site-logo inactive">
                        <h1>OSB</h1>
                    </div> :
                    <Link href={'/'} className="site-logo active">
                        <h1>OSB</h1>
                    </Link>
                }
                <div className="menu-wrapper">
                    <GlobalNav elements={mainMenu} />
                    <Menu elements={mainMenu} />
                </div>
            </div>
        </div>
    </header>;
}
