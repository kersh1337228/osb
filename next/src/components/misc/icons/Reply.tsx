import styles from './styles.module.css';
import { MouseEventHandler } from 'react';

export default function ReplyIcon(
    {
        onClick
    }: {
        onClick?: MouseEventHandler<SVGSVGElement> | undefined;
    }
): React.ReactNode {
    return <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="140 125 769 769"
        className={styles.smallClickable}
        onClick={onClick}
    >
        <path
            d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z"
        />
    </svg>;
}

