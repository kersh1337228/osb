'use server';

import EditForm from '../../../src/components/post/form/EditForm';

export default async function CreatePost() {
    return <main className="fill">
        <EditForm />
    </main>;
}
