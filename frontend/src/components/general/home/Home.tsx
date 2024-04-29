'use server';

import './home.css';
import Latest from '../../post/Latest';

export default async function Home() {
    return <main>
        <section className="welcome-section dark">
            <h1 className="section-header">Welcome to the Open Source Blog</h1>
            <span className="section-text-big">
                Interesting posts about open-source software and hardware
            </span>
        </section>
        <Latest />
        <section className="content-section dark">
            <h1 className="section-header">General project information</h1>
            <div className="double-sided">
                <p className="content-text-single section-text-normal">
                    This site was created for technical enthusiasts who love computer software and hardware.
                    Here you can find information about using open-source software solutions
                    instead of popular proprietary analogs,
                    writing and sharing your own free code using C, C++, Python, etc.,
                    and configuring your machines the way you want them to work.
                    You are not required to be an advanced computer user,
                    vice-versa everything here is structured in a very simple way.
                </p>
                <p className="content-text-single section-text-normal">
                    After you realize how powerful you actually can be in terms of configuring computers,
                    it becomes insanely interesting digging into the problems of this sphere.
                    Then, after you gain some skills, you start noticing some problems of the solutions you and other people use,
                    a little bit later you definitely will want to fix them creating your own software or even hardware.
                    And, of course, you can create your own publications here too.
                </p>
            </div>
        </section>
        <section className="topics-section light">
            <h1 className="section-header">Topics</h1>
            <h1 className="section-subheader">Here are popular article themes</h1>
            <ul className="itemize large">
                <li>Computer programming</li>
                <li>Open-source software</li>
                <li>Unix-based operating systems</li>
                <li>Computer hardware</li>
            </ul>
        </section>
    </main>;
}
