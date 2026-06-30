"use client";

import { ChatDropdown } from "./chat-dropdown";

export function ChatHeader() {
    return (
        <header className="flex items-center justify-between">
            <ChatDropdown />
        </header>
    );
}