import GithubIcon from '../../misc/icons/Github';
import GitlabIcon from '../../misc/icons/Gitlab';
import PlanetIcon from '../../misc/icons/Planet';
import LanguageIcon from '../../misc/icons/Language';
import styles from './styles.module.css';

const categories = [{
    name: 'Software',
    children: [{
        name: 'System'
    }, {
        name: 'Data'
    }, {
        name: 'Web'
    }]
}, {
    name: 'Hardware',
    children: [{
        name: 'Architectures'
    }, {
        name: 'Systems'
    }, {
        name: 'Assembly'
    }]
}, {
    name: 'Math',
    children: [{
        name: 'Optimization'
    }, {
        name: 'Approximation'
    }, {
        name: 'Analysis'
    }]
}];

export default async function Footer() {
    return <footer
        className={styles.footer}
    >
        <div
            className={styles.top}
        >
            <ul
                className={styles.list}
            >
                {categories.map((category, key) =>
                    <li
                        // key={category.id}
                        key={key}
                        className={styles.listItem}
                    >
                        <h2 className={styles.sublistHeader}>
                            {category.name}
                        </h2>
                        <ul
                            className={styles.sublist}
                        >
                            {category.children.map((category, key) =>
                                <li
                                    // key={category.id}
                                    key={key}
                                    className={styles.sublistItem}
                                >
                                    <a
                                        className={styles.highlightButton}
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </li>
                )}
            </ul>
        </div>
        <div
            className={styles.bottom}
        >
            <div
                className={styles.contacts}
            >
                <ul>
                    <li>
                        <a
                            className={styles.ellipticButton}
                            href="https://github.com/kersh1337228"
                        >
                            <GithubIcon />
                        </a>
                    </li>
                    <li>
                        <a
                            className={styles.ellipticButton}
                            href="https://gitlab.com/kersh1337228"
                        >
                            <GitlabIcon />
                        </a>
                    </li>
                </ul>
            </div>
            <div
                className={styles.locale}
            >
                <span
                    className={styles.ellipticButton}
                >
                    <PlanetIcon />
                    Russian Federation
                </span>
                <span
                    className={styles.ellipticButton}
                >
                    <LanguageIcon />
                    English
                </span>
            </div>
            <div className={styles.additional}>
                <a className={styles.highlightButton}>
                    About author
                </a>
            </div>
            <div className={styles.author}>
                MIT License © 2024 Anton Cherevko
            </div>
            <div className={styles.meta}>
                Developed for educational purposes
            </div>
        </div>
    </footer>;
}
