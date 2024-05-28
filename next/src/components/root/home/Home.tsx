import styles from './styles.module.css';
import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod
} from '../../../utils/constants';
import Link from 'next/link';

export default async function Home() {
    const popular_categories = (await serverRequest(
        'post/category',
        HTTPRequestMethod.GET, {
            cache: 'no-store'
        }, {
            limit: 5
        }
    )).data as CategoryPartial[];

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
                    For those who like computer software and hardware.
                    Here you can find information about using free software solutions
                    instead of popular proprietary analogs,
                    writing and sharing your own free code using different programming languages
                    and configuring your machines the way you want them to work.
                </p>
                <p>
                    Share your thoughts about information technologies.
                    Discuss problems you face during software and hardware exploitation.
                    Use free open-source solutions and enjoy.
                    Word collocation "free software" here can be semantically replaced with "libre software".
                </p>
            </div>
        </section>
        <section
            className={styles.section}
        >
            <h1
                className={styles.sectionHeader}
            >
                Popular categories
            </h1>
            <ul
                className={styles.categories}
            >
                {popular_categories.map(category => {
                    const params = new URLSearchParams();
                    params.set('categories', JSON.stringify([category]));

                    return <li
                        key={category.id}
                    >
                        <Link
                            href={`/post?${params.toString()}`}
                            className={styles.category}
                        >
                            {category.title}
                        </Link>
                    </li>;
                })}
            </ul>
        </section>
    </main>;
}
