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
import { useContext, useMemo } from 'react';
import { UserContext } from '../providers/UserProvider';

export default function Header() {
    const path = usePathname();

    // @ts-ignore
    const { user } = useContext(UserContext);
    const id = user ? user.id : null;
    const menu = useMemo(() => {
        return [
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
                href: id ? `/user/${id}` : '/auth/login',
                icon: <UserIcon/>
            }
        ] as NavElement[];
    }, [id]);

    return <header>
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
                <GlobalNav elements={menu}/>
                <Menu elements={menu}/>
            </div>
        </div>
    </header>;
}
