"use client";

import { useEffect, useRef } from "react";
import { useResumeViewer } from "@/components/resume-viewer/resume-viewer-context";

type ChatMessagesProps = {
    messages: Message[];
};

export type Message = {
    role: "user" | "assistant";
    content: string;
};

// Simple regex to parse markdown links [Text](URL) into HTML anchor tags
function parseMarkdownLinks(text: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    // We add a specific data attribute to intercept clicks
    let html = text.replace(linkRegex, '<a href="$2" data-resume-link="true" class="text-blue-500 hover:underline cursor-pointer">$1</a>');
    
    // basic newline to <br> for whitespace-pre-wrap effect
    html = html.replace(/\n/g, '<br />');
    
    return html;
}

export function ChatMessages({
    messages,
}: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { openResume } = useResumeViewer();

    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && target.getAttribute('data-resume-link') === 'true') {
                e.preventDefault();
                const href = target.getAttribute('href');
                if (href) {
                    // Extract ID from http://127.0.0.1:8000/resume/view/ID
                    const parts = href.split('/');
                    const id = parts[parts.length - 1];
                    if (id) {
                        openResume(id);
                    }
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('click', handleLinkClick);
        }

        return () => {
            if (container) {
                container.removeEventListener('click', handleLinkClick);
            }
        };
    }, [openResume]);

    return (
        <div ref={containerRef} className="flex w-full max-w-3xl flex-col gap-6 px-2 pt-4 pb-8">

            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[75%] rounded-3xl px-5 py-3 text-sm leading-7 break-words ${message.role === "user"
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-900"
                            }`}
                        dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(message.content) }}
                    />
                </div>
            ))}

        </div>
    );
}