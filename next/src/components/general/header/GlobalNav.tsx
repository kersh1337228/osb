import Link from 'next/link';
import { usePathname } from 'next/navigation';

export declare type NavElement = {
    name: string;
    href: string;
    icon: React.ReactNode;
};

export default function GlobalNav(
    {
        elements
    }: {
        elements: NavElement[]
    }
): React.ReactNode {
    const path = usePathname();

    return <nav className="main-menu">
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
        </ul>
    </nav>;
}
