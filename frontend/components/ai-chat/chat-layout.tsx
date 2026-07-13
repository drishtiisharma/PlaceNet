"use client";

import { ReactNode } from "react";

type ChatLayoutProps = {
    children: ReactNode;
};

export function ChatLayout({
    children,
}: ChatLayoutProps) {
    return (
        <div className="mx-auto flex h-[calc(100vh-72px)] min-h-0 w-full max-w-5xl flex-col px-6 pb-6">
            {children}
        </div>
    );
}
