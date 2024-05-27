import About from '../../src/components/root/about/About';
import {
    Metadata
} from 'next';

export const metadata: Metadata = {
    title: 'About'
};

export default async function AboutPage() {
    return <About />;
}
