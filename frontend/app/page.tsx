import Home from '../src/components/general/home/Home';
import {
    Metadata
} from 'next';

export const metadata: Metadata = {
    title: 'OSB - Home',
    description: 'Open Source Blog homepage'
};

export default function Page(): React.ReactNode {
    return <Home/>;
}
