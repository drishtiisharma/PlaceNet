"use client";

import { ReactNode } from "react";

type ChatLayoutProps = {
    children: ReactNode;
};

export function ChatLayout({
    children,
}: ChatLayoutProps) {
    return (
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-5xl flex-col px-6">
            {children}
        </div>
    );
}