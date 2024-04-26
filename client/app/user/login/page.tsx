import {
    jsonRequest,
    formDataSerialize
} from '../../../src/utils/functions';
import {
    HTTPRequestMethod,
    serverURL
} from '../../../src/utils/constants';
import { cookies } from 'next/headers';

export default function LoginPage(): React.ReactNode {

    async function submit(
        formData: FormData
    ) {
        'use server';
        const response = await jsonRequest(
            `${serverURL}/user/login`,
            HTTPRequestMethod.POST,
            {
                cache: 'force-cache'
            },
            formDataSerialize(formData)
        );
        return await response.json().then(response => {
            // for (const [key, val] of Object.entries(response) as [string, string][])
            //     cookies().set(key, val);
            return 'Success';
        }).catch((response) => {
            console.log(response);
            return 'Error';
        });
    }

    return <main>
        <form
            method={'post'}
            encType={'multipart/form-data'}
            action={submit}
        >
            <input
                name={'username'}
                type={'text'}
                placeholder={'Username or Email address'}
                required={true}
            />
            <input
                name={'password'}
                type={'password'}
                placeholder={'Password'}
                required={true}
            />
            <button>Login</button>
        </form>
    </main>;
}
