'use server';

export default async function Latest() {
    // TODO: last 3 posts
    // const posts = await

    return <section className="latest-section light">
        <h1 className="section-header">Latest posts</h1>
        <div className="flex-tiles">
            <div className="flex-tile">
                <div className="flex-tile-inner">
                    <div className="flex-tile-content">
                        <p className="card-datetime">
                            <time>2 Sep. 2023</time>
                        </p>
                        <h3 className="card-header">OpenGL Environment</h3>
                        <p className="card-content">
                            Easy to use C++ OpenGL environment based on object oriented approach.
                            Set of wrappers provided allow you to easily configure simple scene.

                            Easy to use C++ OpenGL environment based on object oriented approach.
                            Set of wrappers provided allow you to easily configure simple scene.
                            Easy to use C++ OpenGL environment based on object oriented approach.
                            Set of wrappers provided allow you to easily configure simple scene.
                        </p>
                    </div>
                    <span className="flex-tile-learn-more underline-button">
                            <a href="https://github.com/kersh1337228/glEnv">Learn more</a>
                        </span>
                </div>
            </div>
            <div className="flex-tile">
                <div className="flex-tile-inner">
                    <div className="flex-tile-content">
                        <p className="card-datetime">
                            <time>4 Jul. 2023</time>
                        </p>
                        <h3 className="card-header">React Plot</h3>
                        <p className="card-content"><span>
                                React components library to build plots based on canvas API.
                                Easy syntax and tile structure.
                            </span></p>
                    </div>
                    <span className="flex-tile-learn-more underline-button">
                            <a href="https://github.com/kersh1337228/ReactPlotComponents">Learn more</a>
                        </span>
                </div>
            </div>
            <div className="flex-tile">
                <div className="flex-tile-inner">
                    <div className="flex-tile-content">
                        <p className="card-datetime">
                            <time>17 Jun. 2023</time>
                        </p>
                        <h3 className="card-header">Quotes analysis</h3>
                        <p className="card-content"><span>
                                Python data analysis web-application providing set of instruments to easily create and test investment strategies.
                            </span></p>
                    </div>
                    <span className="flex-tile-learn-more underline-button">
                            <a href="https://github.com/kersh1337228/quotes-analysis">Learn more</a>
                        </span>
                </div>
            </div>
        </div>
    </section>;
}
