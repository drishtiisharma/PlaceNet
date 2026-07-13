"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

type ChatMessagesProps = {
    messages: Message[];
    isTyping?: boolean;
};

export type Message = {
    role: "user" | "assistant";
    content: string;
};

// Simple regex to parse markdown links [Text](URL) into HTML anchor tags
function parseMarkdownLinks(text: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let html = text.replace(linkRegex, '<a href="$2" target="_blank" class="text-blue-500 hover:underline cursor-pointer">$1</a>');
    
    // basic newline to <br> for whitespace-pre-wrap effect
    html = html.replace(/\n/g, '<br />');
    
    return html;
}

export function ChatMessages({
    messages,
    isTyping = false,
}: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={containerRef} className="flex w-full max-w-3xl flex-col gap-6 px-2 pt-4 pb-8">

            {messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`flex gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        {!isUser && (
                            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
                                <Bot size={18} />
                            </div>
                        )}
                        
                        <div
                            className={`max-w-[75%] rounded-3xl px-5 py-3 text-sm leading-7 break-words shadow-sm ${
                                isUser
                                    ? "bg-zinc-900 text-white rounded-tr-sm"
                                    : "bg-zinc-100 text-zinc-900 rounded-tl-sm border"
                            }`}
                            dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(message.content) }}
                        />

                        {isUser && (
                            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-zinc-200 text-zinc-600 shadow-sm">
                                <User size={18} />
                            </div>
                        )}
                    </motion.div>
                );
            })}

            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3 w-full justify-start"
                >
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
                        <Bot size={18} />
                    </div>
                    <div className="flex max-w-[75%] rounded-3xl rounded-tl-sm bg-zinc-100 border shadow-sm px-5 py-4 text-sm text-zinc-500 items-center gap-3">
                        <span className="flex gap-1.5 items-center justify-center mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </span>
                        <span className="font-medium text-zinc-600">PlaceNet AI is thinking...</span>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
