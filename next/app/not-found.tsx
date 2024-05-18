'use server';

export default async function NotFound() {
    return (
        <main className="fill light">
            <h1
                style={{
                    width: '100%',
                    color: 'red',
                    fontSize: '32px'
                }}>
                Page not found
            </h1>
        </main>
    );
}
