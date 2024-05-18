import styles from './styles.module.css';

export default function UserIcon(): React.ReactNode {
    return <svg
        viewBox="3.5 3 17 17"
        className={styles.normal}
    >
        <circle
            cx="12"
            cy="5.5"
            r="2.5">
        </circle>
        <path
            d="M15 10H9a4 4 0 0 0-4 4v7h14v-7a4 4 0 0 0-4-4z"
        ></path>
    </svg>;
}
