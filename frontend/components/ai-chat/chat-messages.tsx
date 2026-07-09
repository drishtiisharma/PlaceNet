"use client";

import { Message } from "./chat-messages";

type ChatMessagesProps = {
    messages: Message[];
};

export type Message = {
    role: "user" | "assistant";
    content: string;
};

export function ChatMessages({
    messages,
}: ChatMessagesProps) {
    return (
        <div className="flex w-full max-w-3xl flex-col gap-6 px-2 pt-4 pb-8">

            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[75%] rounded-3xl px-5 py-3 text-sm leading-7 whitespace-pre-wrap break-words ${message.role === "user"
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-900"
                            }`}
                    >
                        {message.content}
                    </div>
                </div>
            ))}

        </div>
    );
}