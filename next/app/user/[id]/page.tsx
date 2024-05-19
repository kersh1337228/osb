import {
    serverRequest
} from '../../../src/actions/request';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';
import User from '../../../src/components/user/User';

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
        HTTPRequestMethod.GET,
        {
            cache: 'force-cache'
        }
    )).data as User;

    return <User
        user={user}
    />
}
