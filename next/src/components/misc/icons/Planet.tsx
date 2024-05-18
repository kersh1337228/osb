import styles from './styles.module.css';

export default function PlanetIcon(): React.ReactNode {
    return <svg
        viewBox="3 3 18 18"
        className={styles.normal}
    >
        <path
            d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9zm1.78 15.762L11 15.764A2.989 2.989 0 0 0 9 15H5.685A6.96 6.96 0 0 1 13 5.08V7a2 2 0 0 1-2 2h-1a2 2 0 0 0 0 4h4a2.476 2.476 0 0 1 2 1 24.497 24.497 0 0 0 1.84 1.85 7.017 7.017 0 0 1-4.06 2.912z"
        ></path>
    </svg>;
}
