"use client";

import { useEffect, useRef, useState } from "react";

import { ChatHeader } from "@/components/ai-chat/chat-header";
import { ChatLayout } from "@/components/ai-chat/chat-layout";
import { EmptyState } from "@/components/ai-chat/empty-state";
import { PromptBox } from "@/components/ai-chat/prompt-box";
import {
    ChatMessages,
    Message,
} from "@/components/ai-chat/chat-messages";

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <ChatLayout>
            <div className="flex flex-1 min-h-0 flex-col w-full">

                <ChatHeader />

                <div
                    ref={scrollRef}
                    className="flex-1 min-h-0 overflow-y-auto scrollbar-hide"
                >
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center">
                            <EmptyState />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-3xl">
                                <ChatMessages messages={messages} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center w-full">
                    <div className="w-full max-w-3xl">
                        <PromptBox
                            messages={messages}
                            setMessages={setMessages}
                        />
                    </div>
                </div>

            </div>

        </ChatLayout >
    );
}