import {
    serverRequest
} from '../../../src/utils/actions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';
import User from '../../../src/components/user/user/User';
import {
    Metadata
} from 'next';

export async function generateMetadata(
    {
        params
    }: {
        params: {
            id: number
        }
    }
): Promise<Metadata> {
    const user = (await serverRequest(
        `${serverURL}/user/${params.id}`,
        HTTPRequestMethod.GET, {
            cache: 'force-cache'
        }
    )).data as User;

    return {
        title: user.username
    };
}

export default async function UserPage(
    {
        params
    }: {
        params: {
            id: string;
        };
    }
) {
    const user = (await serverRequest(
        `${serverURL}/user/${params.id}`,
        HTTPRequestMethod.GET, {
            cache: 'force-cache'
        }
    )).data as User;

    return <User
        user={user}
    />
}
