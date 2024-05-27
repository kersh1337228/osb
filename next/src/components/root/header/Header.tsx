'use client';

import UserIcon from '../../misc/icons/UserIcon';
import Link from 'next/link';
import {
    usePathname
} from 'next/navigation';
import {
    useContext,
    useState
} from 'react';
import styles from './styles.module.css';
import MenuIcon from '../../misc/icons/Menu';
import {
    UserContext
} from '../../misc/providers/UserProvider';


export default function Header() {
    const user = useContext(UserContext);

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
            href: user ? `/user/${user.id}` : '/user/login',
            icon: <UserIcon/>
        }
    ];

    const [active, setActive] = useState(false);

    return <header
        className={styles.header}
    >
        <div
            className={styles.placeholder}
        >
        </div>
        <div
            className={styles.inner}
        >
            {path === '/' ?
                <div
                    className={styles.logo}
                >
                    <h1>
                        OSB
                    </h1>
                </div> :
                <Link
                    href={'/'}
                    className={styles.logo}
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
