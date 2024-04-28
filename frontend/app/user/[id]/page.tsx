import {
    jsonRequest
} from '../../../src/utils/functions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';

export default async function UserPage(
    {
        params
    }: {
        params: {
            id: string;
        };
    }
) {
    const response = await jsonRequest(
        `${serverURL}/api/user/${params.id}`,
        HTTPRequestMethod.GET,
        {
            cache: 'force-cache'
        }
    ).then(
        response => response.json()
    ).then(response => {
        console.log(response);
        return 'Success';
    }).catch((response) => {
        console.log(response);
        return 'Error';
    });

    return (
        <main>
            <h1>{params.id}</h1>
        </main>
    );
}
