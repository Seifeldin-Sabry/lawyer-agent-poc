import { useState } from 'react';

export default function StreamChat() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStream = async () => {
        setResponse('');
        setLoading(true);

        try {
            const res = await fetch('/api/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [{ role: 'user', content: 'Your question here' }] }),
            });

            if (!res.body) {
                throw new Error('ReadableStream not supported in response');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;

                if (value) {
                    setResponse((prev) => prev + decoder.decode(value));
                }
            }
        } catch (error) {
            console.error('Error streaming response:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleStream} disabled={loading}>
                {loading ? 'Loading...' : 'Ask Question'}
            </button>
            <pre>{response}</pre>
        </div>
    );
}
