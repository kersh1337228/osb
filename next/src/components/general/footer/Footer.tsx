'use server';

import './footer.css';

export default async function Footer() {
    return <footer className="dark">
        <div className="footer-top">
            <ul className="footer-list">
                <li className="footer-list-item">
                    <h2 className="footer-sublist-header">Software</h2>
                    <ul className="footer-sublist">
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                System
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Data
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Web
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="footer-list-item">
                    <h2 className="footer-sublist-header">
                        Hardware
                    </h2>
                    <ul className="footer-sublist">
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Architectures
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Systems
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Assembly
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="footer-list-item">
                    <h2 className="footer-sublist-header">Math</h2>
                    <ul className="footer-sublist">
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Optimization
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Approximation
                            </a>
                        </li>
                        <li className="footer-sublist-item">
                            <a className="highlight-button">
                                Analysis
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div className="footer-bottom">
            <div className="footer-contacts">
                <ul className="footer-contacts-list">
                    <li className="footer-contacts-list-item">
                        <a
                            className="elliptic-button"
                            href="https://github.com/kersh1337228"
                        >
                            <svg
                                viewBox="-6 -6 110 110"
                                className="image small-image"
                            >
                                <path
                                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                                />
                            </svg>
                        </a>
                    </li>
                    <li className="footer-contacts-list-item">
                        <a
                            className="elliptic-button"
                            href="https://gitlab.com/kersh1337228">
                            <svg
                                viewBox="40 20 300 300"
                                className="image small-image">
                                <path
                                    d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="footer-locale">
                <button className="footer-locale-item elliptic-button">
                    <svg viewBox="0 0 24 24" className="country-image image small-image">
                        <path
                            d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9zm1.78 15.762L11 15.764A2.989 2.989 0 0 0 9 15H5.685A6.96 6.96 0 0 1 13 5.08V7a2 2 0 0 1-2 2h-1a2 2 0 0 0 0 4h4a2.476 2.476 0 0 1 2 1 24.497 24.497 0 0 0 1.84 1.85 7.017 7.017 0 0 1-4.06 2.912z"></path>
                    </svg>
                    Russian Federation
                </button>
                <button className="footer-locale-item elliptic-button">
                    <svg viewBox="0 0 24 24" className="language-image image small-image">
                        <path
                            d="m11.62965 16.61452c-1.13922-.692-3.111-2.36313-3.153-2.32718a28.32942 28.32942 0 0 1 -3.30095 2.26177c-.68823.39708-1.38892.49615-1.82064-.09139a.992.992 0 0 1 .26656-1.40406c.00852-.00391 2.44665-1.594 3.25973-2.29678a11.64387 11.64387 0 0 1 -2.23281-3.53521 1.07774 1.07774 0 0 1 .52716-1.36835c.52715-.22205 1.049-.12664 1.48663.61989a10.33341 10.33341 0 0 0 1.8143 2.89517 10.853 10.853 0 0 0 2.1563-4.3469l-7.63293-.02148v-2.00685h4.8124v-.99406a.98574.98574 0 1 1 1.9713 0v.99406h5.1703v2.00685h-2.08646a17.03869 17.03869 0 0 1 -2.64065 5.75689 15.88157 15.88157 0 0 0 2.30149 1.66068l2.3092-5.66617a1.162 1.162 0 0 1 2.1802.01591l3.01041 7.389 1.85638 4.385h-2.47393l-1.08252-2.53924h-4.84082l-.888 2.53924h-2.5993l.287-.69166zm4.31307-5.16715-1.67531 4.55419h3.35059z"></path>
                    </svg>
                    English
                </button>
            </div>
            <div className="footer-additional">
                <ul className="footer-additional-list">
                    <li><a className="highlight-button">About author</a></li>
                </ul>
            </div>
            <div className="footer-author">MIT License © 2024 Anton Cherevko</div>
            <div className="footer-meta">Developed for educational purposes</div>
        </div>
    </footer>;
}
