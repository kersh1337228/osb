'use client';

import UserIcon from '../../misc/icons/UserIcon';
import Link from 'next/link';
import {
    usePathname
} from 'next/navigation';
import {
    useState
} from 'react';
import styles from './styles.module.css';
import MenuIcon from '../../misc/icons/Menu';


export default function Header(
    {
        user
    }: {
        user: UserPartial | null
    }
) {
    const path = usePathname();
    const menu = [
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
            href: user ? `/user/${user.id}` : '/auth/login',
            icon: <UserIcon/>
        }
    ] as NavElement[];

    const [active, setActive] = useState(false);

    return <header className={styles.header}>
        <div className={styles.headerInner}>
            {path === '/' ?
                <div
                    className={styles.siteLogo}
                >
                    <h1>
                        OSB
                    </h1>
                </div> :
                <Link
                    href={'/'}
                    className={styles.siteLogo}
                >
                    <h1
                        className={styles.active}
                    >
                        OSB
                    </h1>
                </Link>
            }
            <div>
                <nav
                    className={styles.mainMenu}
                >
                    <ul>
                        {menu.map(({ name, href, icon }) => {
                            return <li
                                className={styles.linkWrapper}
                                key={name}
                            >
                                {
                                    path === href ?
                                        <span
                                            className={styles.link}
                                        >
                                            {icon ?? name}
                                        </span> :
                                        <Link
                                            href={href}
                                            className={styles.link}
                                        >
                                            {icon ?? name}
                                        </Link>
                                }
                            </li>
                        })}
                    </ul>
                </nav>
                <div className={styles.additionalMenu}>
                    <MenuIcon
                        onClick={(_) => {
                            setActive(active => !active);
                        }}
                    />
                    {active ?
                        <ul>
                            {menu.map(({ name, href, icon }) => {
                                return <li
                                    key={name}
                                >
                                    {
                                        path === href ?
                                            <span
                                                className={styles.link}
                                            >
                                                {icon ?? name}
                                            </span> :
                                            <Link
                                                href={href}
                                                className={styles.link}
                                            >
                                                {icon ?? name}
                                            </Link>
                                    }
                                </li>
                            })}
                        </ul> : null
                    }
                </div>
            </div>
        </div>
    </header>;
}
