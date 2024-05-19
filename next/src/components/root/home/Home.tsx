import styles from './styles.module.css';

export default function Home(): React.ReactNode {
    return <main
        className={styles.home}
    >
        <section
            className={styles.welcome}
        >
            <h1
                className={styles.sectionHeader}
            >
                Open Source Blog
            </h1>
            <span
                className={styles.sectionContent}
            >
                Posts about free open-source software and hardware
            </span>
        </section>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                General project information
            </h1>
            <div
                className={styles.doubleSided}
            >
                <p>
                    For those who love computer software and hardware.
                    Here you can find information about using free software solutions
                    instead of popular proprietary analogs,
                    writing and sharing your own free code using different programming languages
                    and configuring your machines the way you want them to work.
                </p>
                <p>
                    Share your thoughts about information technologies.
                    Discuss problems you face during software and hardware exploitation.
                    It is very important to continue developing, sharing, studying and running free software today.
                    Word collocation "free software" here can be semantically replaced with "libre software".
                </p>
            </div>
        </section>
        <section
            className={styles.topics}
        >
            <h1 className={styles.sectionHeader}>
                Topic examples
            </h1>
            <ul className="itemize large">
                <li>
                    Computer programming
                </li>
                <li>
                    Free open-source software
                </li>
                <li>
                    Unix-based operating systems
                </li>
                <li>
                    Computer hardware
                </li>
            </ul>
        </section>
    </main>;
}
