import {
    Metadata
} from 'next';
import Home from '../src/components/root/home/Home';

export const metadata: Metadata = {
    title: 'OSB - Home',
    description: 'Open Source Blog homepage'
};

export default function Page(): React.ReactNode {
    return <Home/>;
}
