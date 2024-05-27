'use client';

import {
    dateTimeFormat,
    HTTPRequestMethod,
    serverURL
} from '../../../utils/constants';
import PostListItem from '../../post/list/item/PostListItem';
import 'next/font/local';
import {
    Dispatch,
    useContext,
    useState
} from 'react';
import Editable from '../../misc/editable/Editable';
import {
    serverRequest
} from '../../../utils/actions';
import EditableImage from '../../misc/editable/EdiatableImage';
import Image from 'next/image';
import styles from './styles.module.css';
import EditableText from '../../misc/editable/EditableText';
import {
    UserContext
} from '../../misc/providers/UserProvider';
import {
    logout,
    deleteUser
} from './actions';

export default function User(
    {
        user
    }: {
        user: User;
    }
) {
    const auth = useContext(UserContext);

    const [picture, setPicture] = useState(user.profile_picture);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [birthdate, setBirthdate] = useState(user.birthdate);
    const [sex, setSex] = useState(user.sex);
    const [website, setWebsite] = useState(user.website);
    const [about, setAbout] = useState(user.about);

    function setValue(
        name: string,
        dispatch: Dispatch<any>
    ) {
        return async (value: string) => {
            const response = await serverRequest(
                `${serverURL}/user/update/${user.id}`,
                HTTPRequestMethod.PATCH,
                { cache: 'no-store' },
                { [name]: value }
            );

            if (response.ok)
                dispatch(value);

            return response;
        }
    }

    return (
        <main
            className={styles.userPage}
        >
            {auth && auth.id === user.id ? <section
                className={styles.profile}
            >
                <div className={styles.pictureWrapper}>
                    <EditableImage
                        value={picture}
                        setValue={async (value: File | null) => {
                            let data: FormData | Record<string, any>;
                            if (value) {
                                data = new FormData();
                                data.append(
                                    'profile_picture',
                                    value,
                                    value.name
                                );
                            } else
                                data = {
                                    'profile_picture': null
                                };

                            const response = await serverRequest(
                                `${serverURL}/user/update/${user.id}`,
                                HTTPRequestMethod.PATCH,
                                { cache: 'no-store' },
                                data
                            );

                            if (response.ok)
                                setPicture(value ?
                                    `/media/user/${user.id}/${value.name}` : null);

                            return response;
                        }}
                        name="profile_picture"
                        placeholder="Profile picture"
                    >
                        <Image
                            src={picture ?? '/img/user.webp'}
                            alt={'User profile picture'}
                            width={256}
                            height={256}
                            unoptimized={true}
                            className={styles.profilePicture}
                        />
                    </EditableImage>
                    <span
                        className={styles.buttons}
                    >
                        <button
                            className={styles.button}
                            onClick={async (_) => await logout()}
                        >
                            Logout
                        </button>
                        <button
                            className={styles.redButton}
                            onDoubleClick={async (_) => await deleteUser(user.id)}
                        >
                            Delete
                        </button>
                    </span>
                </div>
                <div
                    className={styles.profileData}
                >
                    <div
                        className={styles.primary}
                    >
                        <Editable
                            value={username}
                            setValue={setValue('username', setUsername)}
                            name="username"
                            type="text"
                            placeholder="Username"
                        >
                            <h1
                                className={styles.username}
                            >
                                {username}
                            </h1>
                        </Editable>
                        <span
                            className={styles.lastLogin}
                        >
                            last login: {dateTimeFormat.format(
                            new Date(user.last_login)
                        )}
                        </span>
                    </div>
                    <table
                        className={styles.secondary}
                    >
                        <tbody>
                        <tr
                            className="full-name font-small"
                        >
                            <th>
                                Email:
                            </th>
                            <td>
                                <Editable
                                    value={email}
                                    setValue={setValue('email', setEmail)}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                >
                                    {email}
                                </Editable>
                            </td>
                        </tr>
                        <tr
                            className="first-name font-small"
                        >
                            <th>
                                First name:
                            </th>
                            <td>
                                <Editable
                                    value={firstName}
                                    setValue={setValue('first_name', setFirstName)}
                                    allowDelete={true}
                                    name="first_name"
                                    type="text"
                                    placeholder="First name"
                                >
                                    {firstName ?? '-'}
                                </Editable>
                            </td>
                        </tr>
                        <tr
                            className="last-name font-small"
                        >
                            <th>
                                Last name:
                            </th>
                            <td>
                                <Editable
                                    value={lastName}
                                    setValue={setValue('last_name', setLastName)}
                                    allowDelete={true}
                                    name="last_name"
                                    type="text"
                                    placeholder="Last name"
                                >
                                    {lastName ?? '-'}
                                </Editable>
                            </td>
                        </tr>
                        <tr
                            className="birthdate font-small"
                        >
                            <th>
                                Birthdate:
                            </th>
                            <td>
                                <Editable
                                    value={birthdate}
                                    setValue={setValue('birthdate', setBirthdate)}
                                    allowDelete={true}
                                    name="birthdate"
                                    type="date"
                                    placeholder="Birthdate"
                                >
                                    {birthdate ? (new Date(birthdate))
                                        .toLocaleDateString('ru-RU') : '-'}
                                </Editable>
                            </td>
                        </tr>
                        <tr
                            className="sex font-small"
                        >
                            <th>
                                Sex:
                            </th>
                            <td>
                                <Editable
                                    value={sex}
                                    setValue={setValue('sex', setSex)}
                                    allowDelete={true}
                                    name="sex"
                                    type="text"
                                    placeholder="Sex"
                                >
                                    {sex ?? '-'}
                                </Editable>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Website:
                            </th>
                            <td>
                                <Editable
                                    value={website}
                                    setValue={setValue('website', setWebsite)}
                                    allowDelete={true}
                                    name="website"
                                    type="url"
                                    placeholder="Website"
                                >
                                    {website ? <a
                                        href={website}
                                        className={styles.website}
                                    >
                                        {website}
                                    </a> : '-'}
                                </Editable>
                            </td>
                        </tr>
                        <tr>
                            <th colSpan={2}>
                                About:
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={2} className={styles.about}>
                                <EditableText
                                    value={about}
                                    setValue={setValue('about', setAbout)}
                                    allowDelete={true}
                                    name="about"
                                    placeholder="About"
                                >
                                    <p>
                                        {about ?? '-'}
                                    </p>
                                </EditableText>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section> : <section
                className={styles.profile}
            >
                <div>
                    <Image
                        src={picture ?? '/img/user.webp'}
                        alt={'User profile picture'}
                        width={256}
                        height={256}
                        unoptimized={true}
                        className={styles.profilePicture}
                    />
                </div>
                <div
                    className={styles.profileData}
                >
                    <div
                        className={styles.primary}
                    >
                        <h1
                            className={styles.username}
                        >
                            {username}
                        </h1>
                        <span
                            className={styles.lastLogin}
                        >
                            last login: {dateTimeFormat.format(
                            new Date(user.last_login)
                        )}
                        </span>
                    </div>
                    <table
                        className={styles.secondary}
                    >
                        <tbody>
                        <tr
                            className="full-name font-small"
                        >
                            <th>
                                Email:
                            </th>
                            <td>
                                {email}
                            </td>
                        </tr>
                        <tr
                            className="first-name font-small"
                        >
                            <th>
                                First name:
                            </th>
                            <td>
                                {firstName ?? '-'}
                            </td>
                        </tr>
                        <tr
                            className="last-name font-small"
                        >
                            <th>
                                Last name:
                            </th>
                            <td>
                                {lastName ?? '-'}
                            </td>
                        </tr>
                        <tr
                            className="birthdate font-small"
                        >
                            <th>
                                Birthdate:
                            </th>
                            <td>
                                {birthdate ? (new Date(birthdate))
                                    .toLocaleDateString('ru-RU') : null}
                            </td>
                        </tr>
                        <tr
                            className="sex font-small"
                        >
                            <th>
                                Sex:
                            </th>
                            <td>
                                {sex ?? '-'}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Website:
                            </th>
                            <td>
                                {website ? <a
                                    href={website}
                                    className={styles.website}
                                >
                                    {website}
                                </a> : '-'}
                            </td>
                        </tr>
                        <tr>
                            <th colSpan={2}>
                                About:
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={2} className={styles.about}>
                                <p>
                                    {about ?? '-'}
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>}
            <section
                className={styles.posts}
            >
                <h1>
                    Posts
                </h1>
                <ul>
                    {user.posts.map(post =>
                        <PostListItem
                            post={post}
                            key={post.id}
                        />
                    )}
                </ul>
            </section>
        </main>
    );
}
