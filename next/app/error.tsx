'use client';

export default async function ErrorPage(
    {
        error,
        reset
    }: {
        error: Error & { digest?: string }
        reset: () => void
    }
) {
    return <main>
        <h1>
            {error.message}
        </h1>
        <button
            onClick={reset}
        >
            Retry
        </button>
    </main>;
}
