'use client';

import Link from 'next/link';
import {
    usePathname
} from 'next/navigation';
import {
    NavElement
} from './GlobalNav';
import {
    useState
} from 'react';

export default function Menu(
    {
        elements
    }: {
        elements: NavElement[]
    }
): React.ReactNode {
    const [active, setActive] = useState(false);

    const path = usePathname();

    return <div className="additional-menu">
        <svg
            viewBox="0 0 24 24"
            fill="white"
            className="svg-icon elliptic_button"
            onClick={() => {
                setActive(active => !active);
            }}
        >
            <path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"></path>
        </svg>
        {active ?
            <ul>
                {elements.map(({ name, href, icon }) => {
                    return <li className="main-menu-link-wrapper" key={name}>
                        {
                            path === href ?
                                <div className="main-menu-link inactive">
                                    {icon ?? name}
                                </div> :
                                <Link href={href} className="main-menu-link active">
                                    {icon ?? name}
                                </Link>
                        }
                    </li>
                })}
            </ul> : null
        }
    </div>;
}
