import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

type StreamChatHook = {
    messages: Message[];
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
};

export function useStreamChat(apiEndpoint: string): StreamChatHook {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }, []);

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();

            if (input.trim()) {
                const userMessage: Message = { role: 'user', content: input };
                setMessages((prev) => [...prev, userMessage]);
                setInput('');

                try {
                    const res = await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ messages: [...messages, userMessage] }),
                    });

                    if (!res.body) {
                        throw new Error('No response body found in response');
                    }

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let assistantResponse = '';
                    let done = false;

                    while (!done) {
                        const { value, done: readerDone } = await reader.read();
                        done = readerDone;

                        if (value) {
                            assistantResponse += decoder.decode(value);
                        }
                    }

                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: assistantResponse },
                    ]);
                } catch (error) {
                    console.error('Error in handleSubmit:', error);
                }
            }
        },
        [apiEndpoint, input, messages]
    );

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
    };
}
