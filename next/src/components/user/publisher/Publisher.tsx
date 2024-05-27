import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';

export default function Publisher(
    {
        user
    }: {
        user: UserPartial
    }
) {
    return <Link
        href={`/user/${user.id}`}
        className={user.is_superuser ? styles.superuser : styles.publisher}
    >
        <Image
            src={user.profile_picture ?? '/img/user.webp'}
            alt={'User profile picture'}
            width={32}
            height={32}
            unoptimized={true}
            className={styles.picture}
        />
        {user.username}
    </Link>;
}
