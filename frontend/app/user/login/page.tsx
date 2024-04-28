'use client';

import {
    jsonRequest,
    formDataSerialize
} from '../../../src/utils/functions';
import {
    HTTPRequestMethod,
    clientURL
} from '../../../src/utils/constants';

export default function LoginPage(): React.ReactNode {

    async function submit(
        formData: FormData
    ) {
        const response = await jsonRequest(
            `${clientURL}/api/user/login`,
            HTTPRequestMethod.POST,
            {
                cache: 'force-cache'
            },
            formDataSerialize(formData)
        );
        return await response.json().then(response => {
            console.log(response);
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
