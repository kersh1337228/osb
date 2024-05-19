'use client';

import {
    dateTimeFormat, HTTPRequestMethod, serverURL
} from '../../utils/constants';
import PostListItem from '../post/list/PostListItem';
import {
    Dispatch,
    useState
} from 'react';
import Editable from '../misc/form/Editable';
import {
    serverRequest
} from '../../actions/request';
import TextField from '../misc/form/TextField';
import EditableImage from '../misc/form/EdiatableImage';
import Image from 'next/image';
import styles from './styles.module.css';
import Link from 'next/link';
import CommentIcon from '../misc/icons/Comment';
import Comment from './comment/Comment';
import Reactions from './reaction/Reactions';
import Publisher from '../user/publisher/Publisher';

export default function Post(
    {
        post
    }: {
        post: Post;
    }
) {
    // console.log(post);

    // const [picture, setPicture] = useState(user.profile_picture);
    // const [username, setUsername] = useState(user.username);
    // const [email, setEmail] = useState(user.email);
    // const [firstName, setFirstName] = useState(user.first_name);
    // const [lastName, setLastName] = useState(user.last_name);
    // const [birthdate, setBirthdate] = useState(user.birthdate);
    // const [sex, setSex] = useState(user.sex);
    // const [website, setWebsite] = useState(user.website);
    // const [about, setAbout] = useState(user.about);
    //
    // function setValue(
    //     name: string,
    //     dispatch: Dispatch<any>
    // ) {
    //     return async (value: string) => {
    //         const response = await serverRequest(
    //             `${serverURL}/user/update/${user.id}`,
    //             HTTPRequestMethod.PATCH,
    //             { cache: 'no-store' },
    //             { [name]: value }
    //         );
    //
    //         if (response.ok)
    //             dispatch(value);
    //
    //         return response;
    //     }
    // }

    return <main
        className={styles.postPage}
    >
        <section>
            <span
                className={styles.postPublisher}
            >
                <Publisher
                    user={post.publisher}
                />
                <Link
                    href={`/post/${post.id}`}
                    // className={styles.postTitle}
                >
                    {post.title}
                </Link>
            </span>
            <div>
                <div
                    className={styles.postDate}
                >
                    created: {dateTimeFormat.format(
                    new Date(post.publish_time)
                )}
                </div>
                <div
                    className={styles.postDate}
                >
                    updated: {dateTimeFormat.format(
                    new Date(post.update_time)
                )}
                </div>
            </div>
        </section>
        <section
            className={styles.content}
        >
            <p>
                {post.content}.
            </p>
            <p>
                Phasellus tempus vehicula lorem, a finibus ligula euismod sit amet. Quisque lorem magna, dictum nec
                malesuada nec, fringilla nec quam. Etiam in laoreet lacus. Aliquam posuere lorem et tellus rhoncus
                pretium. Vivamus ultricies ex vel turpis aliquet feugiat. Sed ac sollicitudin turpis. Suspendisse
                dignissim, purus sed congue fermentum, purus arcu finibus nisi, quis posuere tellus lacus sit amet
                purus. Aliquam ut semper tellus. Pellentesque tellus nibh, auctor a viverra id, varius sit amet ante.
                Donec nec ex lectus.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis viverra ex sit amet tempus.
                Suspendisse vitae sapien vitae metus fermentum volutpat et nec lectus. Duis porttitor nibh a diam
                blandit, accumsan consectetur odio porta. Integer quis felis a magna blandit convallis. Praesent rutrum
                vel mi a suscipit. Nullam laoreet vitae velit vel sodales. Duis venenatis neque quis orci sagittis
                pretium. Vestibulum nec ante sit amet nisl aliquet venenatis. Vivamus mollis massa id accumsan tempor.
                Cras porta pulvinar ex, a convallis tortor condimentum eget. Curabitur eget tincidunt nunc. Fusce
                tincidunt interdum lectus, eu pellentesque orci tempus a. Proin vel sapien eget turpis condimentum
                aliquet. Vestibulum consequat eros a quam laoreet, condimentum tempus eros fermentum. Aliquam erat
                volutpat. Suspendisse tincidunt bibendum ultricies.
                Fusce luctus magna sit amet ipsum viverra, vitae laoreet lectus pharetra. Nulla dui ex, viverra vitae
                elit id, rutrum pretium purus. Nunc venenatis laoreet neque, id congue dolor suscipit sed. Nunc
                tincidunt nibh aliquam nisl bibendum, quis elementum ex tristique. In luctus venenatis nisl id
                convallis. Fusce consectetur in erat id hendrerit. Mauris dictum ligula vitae augue varius ultricies id
                et ligula. Suspendisse potenti. Nam ut maximus nisl. Donec semper, libero consectetur accumsan volutpat,
                turpis justo auctor urna, at condimentum ligula leo eu purus. Integer faucibus interdum turpis, ut
                suscipit velit. Integer maximus mauris venenatis convallis iaculis. Aenean sed augue pulvinar, mollis
                lectus quis, ornare erat. Sed eu finibus quam. Etiam nunc risus, finibus ut tempus in, condimentum et
                tortor.
                Donec at venenatis sapien. Etiam commodo viverra posuere. Praesent pellentesque posuere commodo. Nulla
                non ipsum egestas ligula volutpat semper ut sed turpis. Quisque rutrum turpis diam, nec rutrum felis
                egestas non. Suspendisse viverra massa a laoreet mollis. Suspendisse placerat, ante et pellentesque
                suscipit, mi sapien fringilla elit, non mollis dui elit id lectus. Vestibulum sollicitudin luctus est,
                ac fringilla odio condimentum non. Aenean cursus, urna et condimentum egestas, dui augue condimentum
                quam, eu placerat leo sem vel orci. Donec nulla risus, elementum nec egestas in, finibus imperdiet
                risus. Ut pellentesque mi ut nisi viverra porta. Vivamus pellentesque sit amet mi nec lacinia. Morbi
                vestibulum pretium dui, nec efficitur nibh pulvinar a. Suspendisse venenatis at orci nec auctor.
                Etiam cursus commodo lorem, at interdum nisl venenatis et. Proin non massa odio. Curabitur sit amet
                feugiat quam. Ut tempor vulputate nunc ac elementum. Integer vitae magna sapien. In vitae tortor
                placerat, dictum orci vitae, tempor nisi. Nam eget dictum neque. Nulla facilisi. Nullam in ultrices
                libero. Quisque vitae magna laoreet, vestibulum diam eget, sodales urna. Class aptent taciti sociosqu ad
                litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora
                torquent per conubia nostra, per inceptos himenaeos. Sed vitae est euismod, vestibulum dui nec,
                facilisis purus. Phasellus vestibulum arcu sit amet bibendum convallis. Donec ac aliquet est. Donec
                tempor facilisis finibus.
            </p>
            <p>
                Nullam a nibh nec nisl pretium eleifend. Etiam sit amet ipsum a lacus hendrerit molestie. Morbi purus
                leo, rutrum malesuada lorem ut, ultricies finibus neque. In finibus rhoncus risus et gravida.
                Suspendisse velit turpis, bibendum et elit sit amet, congue commodo neque. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Sed rhoncus egestas erat, et semper massa
                malesuada tristique. Donec vitae accumsan purus. Nunc scelerisque lacus sed turpis ultrices pretium.
                Etiam eu cursus dui. Quisque suscipit neque at vulputate pretium. Sed molestie metus quis faucibus
                mollis. Vivamus nulla purus, dictum et enim vel, molestie dignissim ipsum.
                Suspendisse vel euismod nulla. Integer gravida, enim a venenatis mattis, enim ligula euismod ligula,
                vitae fermentum urna diam quis eros. Orci varius natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus. Sed non ante non quam fringilla molestie. Donec nisi lacus, hendrerit et turpis
                at, dictum viverra orci. Maecenas sed ligula dolor. Duis ut ultricies erat, viverra convallis mi.
                Donec placerat elit luctus interdum dictum. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. Mauris aliquam neque a venenatis ultrices. Suspendisse aliquet, elit
                vitae luctus mollis, nunc est bibendum nisl, vitae dictum dolor nisl in urna. Suspendisse semper elit et
                est pulvinar, porttitor blandit risus vulputate. Aliquam congue leo est, eu egestas turpis rutrum
                eleifend. Curabitur tristique, sem quis blandit imperdiet, mauris mi pulvinar nibh, sit amet varius
                magna augue ac risus. Fusce ornare ligula et est maximus condimentum. Sed ac erat dictum, interdum nibh
                ac, condimentum felis. Nam id sapien sagittis purus finibus pretium ut vel dolor. Duis neque dolor,
                pretium non nunc nec, fringilla egestas dolor. Nullam quis blandit augue. Nam est leo, hendrerit eget
                dignissim auctor, maximus id massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                per inceptos himenaeos. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus vulputate
                mattis fermentum.

            </p>
            <p>
                Integer pharetra finibus urna sit amet tincidunt. Curabitur scelerisque in ante ut placerat. Nunc dictum
                diam dui, non eleifend sem posuere at. Donec in dignissim nibh. Integer ipsum dui, viverra sit amet
                efficitur ut, hendrerit sit amet massa. Pellentesque vel nunc ipsum. Cras venenatis quam mauris, sit
                amet euismod sem semper id. Aenean dapibus elit ac suscipit fermentum. Cras cursus rhoncus tortor, vel
                efficitur est ultricies vitae. Cras magna sapien, luctus at ex non, bibendum porta nisl. Curabitur
                pharetra nec ligula sit amet sollicitudin. Proin eu eros sagittis, maximus erat sit amet, gravida
                turpis. Nam tincidunt sollicitudin nisl fringilla lobortis.
                Proin tincidunt lectus eget leo bibendum fringilla. Mauris vehicula, eros at blandit sollicitudin, metus
                magna accumsan est, eu congue ipsum felis vel lorem. Proin sit amet urna a nisl aliquet laoreet vel id
                arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam ac
                sapien eu ipsum luctus eleifend. Quisque dui libero, hendrerit ac iaculis a, pulvinar eu ipsum. Praesent
                in porta metus. Morbi viverra mauris nec justo euismod, non euismod tellus accumsan.
            </p>
        </section>
        <Reactions
            reactions={post.reactions}
            reacted_to={post.id}
        />
        <section
            id="comments"
            style={{
                padding: '5% 30%'
            }}
        >
            <h1>
                Comments
            </h1>
            <ul>
                {post.comments.map(comment =>
                    <Comment
                        key={comment.id}
                        comment={comment}
                        commented_post={post.id}
                    />
                )}
            </ul>
        </section>
    </main>;
}
