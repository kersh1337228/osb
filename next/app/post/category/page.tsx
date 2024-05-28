import {
    serverRequest
} from '../../../src/utils/actions';
import {
    HTTPRequestMethod
} from '../../../src/utils/constants';
import {
    Metadata
} from 'next';
import CategoryList from '../../../src/components/post/category/CategoryList';

export const metadata: Metadata = {
    title: 'Categories'
};

export default async function Categories() {
    const categories = (await serverRequest(
        'post/category/list',
        HTTPRequestMethod.GET, {
            cache: 'no-store'
        }
    )).data as Category[];

    return <CategoryList
        categoriesInit={categories}
    />
}
