'use server';

export default async function NotFound() {
    return (
        <main className="fill dark">
            <h1 className="error-text giant" style={{
                width: '100%'
            }}>Page not found</h1>
        </main>
    );
}
