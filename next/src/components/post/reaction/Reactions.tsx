'use client';

import styles from './styles.module.css';
import {
    useContext,
    useMemo,
    useState
} from 'react';
import Publisher from '../../user/publisher/Publisher';
import {
    UserContext
} from '../../misc/providers/UserProvider';
import {
    serverRequest
} from '../../../utils/actions';
import {
    HTTPRequestMethod
} from '../../../utils/constants';

export default function Reactions(
    {
        post
    }: {
        post: PostMixin;
    }
) {
    const user = useContext(UserContext);

    const [reacts, setReacts] = useState(post.reactions);
    const [negVisible, setNegVisible] = useState(false);
    const [posVisible, setPosVisible] = useState(false);

    const [negHandler, posHandler] = useMemo(() => {
        let negHandler: (() => Promise<void>) | undefined,
            posHandler: (() => Promise<void>) | undefined;

        if (user && user.id !== post.publisher.id) {
            const active = reacts.neg.concat(reacts.pos).find(
                react => react.publisher.id === user.id);
            if (active)
                if (active.type) {
                    negHandler = async () => {
                        const response = await serverRequest(
                            `post/reaction/update/${active.id}`,
                            HTTPRequestMethod.PATCH,
                            { cache: 'no-store' },
                            {
                                type: false,
                                reacted_to: post.id
                            }
                        );
                        if (response.ok)
                            setReacts(reacts => ({
                                neg: reacts.neg.concat(response.data as Reaction),
                                pos: reacts.pos.filter(react => react.id !== active.id)
                            }));
                    };
                    posHandler = async () => {
                        const response = await serverRequest(
                            `post/reaction/delete/${active.id}`,
                            HTTPRequestMethod.DELETE,
                            { cache: 'no-store' }
                        );
                        if (response.ok)
                            setReacts(reacts => ({
                                neg: reacts.neg,
                                pos: reacts.pos.filter(react => react.id !== active.id)
                            }));
                    }
                } else {
                    negHandler = async () => {
                        const response = await serverRequest(
                            `post/reaction/delete/${active.id}`,
                            HTTPRequestMethod.DELETE,
                            { cache: 'no-store' }
                        );
                        if (response.ok)
                            setReacts(reacts => ({
                                neg: reacts.neg.filter(react => react.id !== active.id),
                                pos: reacts.pos
                            }));
                    };
                    posHandler = async () => {
                        const response = await serverRequest(
                            `post/reaction/update/${active.id}`,
                            HTTPRequestMethod.PATCH,
                            { cache: 'no-store' },
                            {
                                type: true,
                                reacted_to: post.id
                            }
                        );
                        if (response.ok)
                            setReacts(reacts => ({
                                neg: reacts.neg.filter(react => react.id !== active.id),
                                pos: reacts.pos.concat(response.data as Reaction)
                            }));
                    };
                }
            else {
                negHandler = async () => {
                    const response = await serverRequest(
                        'post/reaction/create',
                        HTTPRequestMethod.POST,
                        { cache: 'no-store' },
                        {
                            type: false,
                            reacted_to: post.id
                        }
                    );
                    if (response.ok)
                        setReacts(reacts => ({
                            neg: reacts.neg.concat(response.data as Reaction),
                            pos: reacts.pos
                        }));
                };
                posHandler = async () => {
                    const response = await serverRequest(
                        'post/reaction/create',
                        HTTPRequestMethod.POST,
                        { cache: 'no-store' },
                        {
                            type: true,
                            reacted_to: post.id
                        }
                    );
                    if (response.ok)
                        setReacts(reacts => ({
                            neg: reacts.neg,
                            pos: reacts.pos.concat(response.data as Reaction)
                        }));
                };
            }
        }

        return [negHandler, posHandler];
    }, [reacts.neg.length, reacts.pos.length]);

    const neg = <span
        className={styles.negative}
        onMouseEnter={(_) => setNegVisible(true)}
        onMouseLeave={(_) => setNegVisible(false)}
    >
        <span
            onClick={negHandler}
            className={styles.rating}
        >
            - {reacts.neg.length}
        </span>
        {negVisible && reacts.neg.length ? <ul
            className={styles.publishers}
        >
            {reacts.neg.map(react =>
                <li
                    key={react.id}
                    className={styles.publisher}
                >
                    <Publisher
                        user={react.publisher}
                    />
                </li>
            )}
        </ul> : null}
    </span>;

    const pos = <span
        className={styles.positive}
        onMouseEnter={(_) => setPosVisible(true)}
        onMouseLeave={(_) => setPosVisible(false)}
    >
        <span
            onClick={posHandler}
            className={styles.rating}
        >
            + {reacts.pos.length}
        </span>
        {posVisible && reacts.pos.length ? <ul
            className={styles.publishers}
        >
            {reacts.pos.map(react =>
                <li
                    key={react.id}
                    className={styles.publisher}
                >
                    <Publisher
                        user={react.publisher}
                    />
                </li>
            )}
        </ul> : null}
    </span>;

    return <span
        className={styles.reactions}
    >
        {neg} / {pos}
    </span>;
}
