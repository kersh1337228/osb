import GithubIcon from '../../misc/icons/Github';
import GitlabIcon from '../../misc/icons/Gitlab';
import PlanetIcon from '../../misc/icons/Planet';
import LanguageIcon from '../../misc/icons/Language';
import styles from './styles.module.css';
import Link from 'next/link';

export default async function Footer() {
    return <footer
        className={styles.footer}
    >
        <div
            className={styles.inner}
        >
            <div
                className={styles.row}
            >
                <span
                    className={styles.contacts}
                >
                    <ul>
                        <li>
                            <a
                                className={styles.ellipticButton}
                                href="https://github.com/kersh1337228"
                            >
                                <GithubIcon/>
                            </a>
                        </li>
                        <li>
                            <a
                                className={styles.ellipticButton}
                                href="https://gitlab.com/kersh1337228"
                            >
                                <GitlabIcon/>
                            </a>
                        </li>
                    </ul>
                </span>
                <span
                    className={styles.locale}
                >
                    <span
                        className={styles.ellipticButton}
                    >
                        <PlanetIcon/>
                        Russian Federation
                    </span>
                    <span
                        className={styles.ellipticButton}
                    >
                        <LanguageIcon/>
                        English
                    </span>
                </span>
            </div>
            <div className={styles.additional}>
                <Link
                    href={'/about#author'}
                    className={styles.link}
                >
                    About author
                </Link>
            </div>
            <div className={styles.row}>
                <span
                    className={styles.meta}
                >
                    MIT License © 2024 Anton Cherevko
                </span>
                <span
                    className={styles.meta}
                >
                    Developed for educational purposes
                </span>
            </div>
        </div>
    </footer>;
}
