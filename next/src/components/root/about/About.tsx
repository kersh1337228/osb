import styles from './styles.module.css';

export default async function About() {
    return <main
        className={styles.about}
    >
        <section
            className={styles.tech}
        >
            <h1
                className={styles.sectionHeader}
            >
                Site stack
            </h1>
            <ul
                className={styles.list}
            >
                <li>
                    <h2>
                        Python
                    </h2>
                    <ul>
                        <li>
                            Django
                        </li>
                        <li>
                            Django Rest Framework
                        </li>
                        <li>
                            Uvicorn
                        </li>
                    </ul>
                </li>
                <li>
                    <h2>
                        TypeScript
                    </h2>
                    <ul>
                        <li>
                            React
                        </li>
                        <li>
                            Next
                        </li>
                    </ul>
                </li>
                <li>
                    <h2>
                        Reverse proxy
                    </h2>
                    <ul
                        className={styles.subList}
                    >
                        <li>
                            Nginx
                        </li>
                        <li>
                            Certbot
                        </li>
                    </ul>
                </li>
                <li>
                    <h2>
                        Helpers
                    </h2>
                    <ul
                        className={styles.subList}
                    >
                        <li>
                            PostgreSQL
                        </li>
                        <li>
                            Docker
                        </li>
                    </ul>
                </li>
            </ul>
            <h6>
                * Exact technology stack could be found in
                project <a
                    href="https://github.com/kersh1337228/osb"
                >
                    repository
                </a>
            </h6>
        </section>
        <section
            id="author"
            className={styles.author}
        >
            <h1
                className={styles.sectionHeader}
            >
                Author
            </h1>
            <p>
                Anton Cherevko, Russian Federation / Saint-Petersburg.
            </p>
            <p>
                I like computer software and hardware.
            </p>
            <p>
                For other projects explore my GitHub and GitLab pages listed in footer.
            </p>
        </section>
        <section
            className={styles.license}
        >
            <h1
                className={styles.sectionHeader}
            >
                License
            </h1>
            <p className="section-subheader">
                MIT License
            </p>
            <p>
                Copyright (c) 2024 Anton Cherevko
            </p>
            <div className="paragraphs narrow">
                <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                </p>
                <p>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                </p>
                <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </p>
            </div>
        </section>
    </main>;
}
