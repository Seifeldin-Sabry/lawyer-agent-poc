'use client'

import {useStreamChat} from "@/hooks/StreamChatHook";

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useStreamChat('/api/chat')

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`${
                            m.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                    >
            <span
                className={`inline-block p-2 rounded-lg ${
                    m.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}
            >
              {m.content}
            </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
                <div className="flex">
                    <input
                        className="flex-grow mr-2 p-2 bg-gray-700 text-white rounded"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}

