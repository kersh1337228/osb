import {
    MouseEventHandler
} from 'react';
import styles from './styles.module.css';

export default function MenuIcon(
    {
        onClick
    }: {
        onClick?: MouseEventHandler<SVGSVGElement> | undefined;
    }
): React.ReactNode {
    return <svg
        viewBox="5 4.5 15 15"
        fill="white"
        className={styles.normal}
        onClick={onClick}
    >
        <path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"></path>
    </svg>;
}
