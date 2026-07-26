"use client";

import { useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { AttachmentButton } from "./attachment-button";
import { SendButton } from "./send-button";
import { UploadedFile } from "./uploaded-file";
import { Message } from "./chat-messages";
import { fetchApi } from "@/lib/api";

type PromptBoxProps = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    sessionId: string | null;
    setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
    isTyping?: boolean;
    setIsTyping?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PromptBox({
    messages,
    setMessages,
    sessionId,
    setSessionId,
    isTyping,
    setIsTyping
}: PromptBoxProps) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    async function handleSend() {
        if (!message.trim() || isTyping) return;

        const userMessage: Message = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentMessage = message;
        setMessage("");

        if (setIsTyping) setIsTyping(true);

        try {
            const response = await fetchApi("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: currentMessage,
                    session_id: sessionId
                }),
            });

            const data = await response.json();

            if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
                localStorage.setItem("chatSessionId", data.session_id);
            }

            const aiMessage: Message = {
                role: "assistant",
                content: data.reply,
            };

            if (setIsTyping) setIsTyping(false);
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            if (setIsTyping) setIsTyping(false);
            
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I'm having trouble connecting right now. Please try again later.",
                },
            ]);
        }
    }

    return (
        <div className="w-full max-w-3xl rounded-3xl border bg-background px-4 py-3 shadow-sm">

            {file && (
                <div className="mb-3">
                    <UploadedFile
                        fileName={file.name}
                        onRemove={() => setFile(null)}
                    />
                </div>
            )}

            <div className="flex items-end gap-3">

                <AttachmentButton
                    onClick={() => fileInputRef.current?.click()}
                />

                <Textarea
                    placeholder="Ask PlaceNet AI anything..."
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = "0px";
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    className="
                        flex-1
                        min-h-0
                        max-h-40
                        resize-none
                        overflow-y-auto
                        border-0
                        bg-transparent
                        px-0
                        py-2
                        text-base
                        leading-6
                        shadow-none
                        focus-visible:ring-0
                    "
                />

                <SendButton
                    disabled={!message.trim()}
                    isLoading={isTyping}
                    onClick={handleSend}
                />

            </div>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
            />

        </div>
    );
}
