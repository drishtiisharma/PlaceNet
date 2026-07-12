"use client";

import { ChatDropdown } from "./chat-dropdown";

interface ChatHeaderProps {
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onCreateNewChat: () => void;
}

export function ChatHeader({ currentSessionId, onSelectSession, onCreateNewChat }: ChatHeaderProps) {
    return (
        <header className="flex items-center justify-between">
            <ChatDropdown 
                currentSessionId={currentSessionId}
                onSelectSession={onSelectSession}
                onCreateNewChat={onCreateNewChat}
            />
        </header>
    );
}