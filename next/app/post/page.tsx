'use server';

import Link from 'next/link';

export default async function Posts() {
    return <main>
        <section className="about-section light">
            <h1 className="section-header">Posts view</h1>
            <ul>
                <li>
                    <Link href={'post/create'} style={{
                        background: 'green',
                        color: 'white',
                        padding: 12,
                        borderRadius: 24
                    }}>
                        Add new post
                    </Link>
                </li>
                {/*<li>*/}
                {/*    <Link href={'post/create'} style={{*/}
                {/*        background: 'green',*/}
                {/*        color: 'white',*/}
                {/*        padding: 12,*/}
                {/*        borderRadius: 24*/}
                {/*    }}>*/}
                {/*        Add new post*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>
        </section>
        <section className="dark">
            <h1 className="section-header">Main technologies used</h1>
            <ul className="itemize large">
                <li>
                    <h2>python</h2>
                    <ul className="itemize">
                        <li>django</li>
                        <li>django rest framework</li>
                        <li>uvicorn</li>
                    </ul>
                </li>
                <li>
                    <h2>javascript</h2>
                    <ul className="itemize">
                        <li>react</li>
                        <li>next</li>
                        <li>typescript</li>
                    </ul>
                </li>
                <li>
                    <h2>proxy</h2>
                    <ul className="itemize">
                        <li>nginx</li>
                        <li>certbot</li>
                        <li>postgresql</li>
                    </ul>
                </li>
            </ul>
            <h6 className="note">* All combined by docker compose</h6>
            <h6 className="note">
                * Exact technology stack could be found in project <a
                className="inline-ref"
                href="https://github.com/kersh1337228/osb">
                repository
            </a>
            </h6>
        </section>
        <section className="light">
            <h1 className="section-header">License</h1>
            <h2 className="section-subheader">MIT License</h2>
            <span>Copyright (c) 2024 Anton Cherevko</span>
            <div className="paragraphs narrow">
                <p className="content-text-single section-text-normal">
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                </p>
                <p className="content-text-single section-text-normal">
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                </p>
                <p className="content-text-single section-text-normal">
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
