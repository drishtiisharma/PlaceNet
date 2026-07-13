"use client";

import { Bot } from "lucide-react";

export function EmptyState() {
    return (
        <div className="mb-8 flex flex-col items-center gap-3 text-center">

            <Bot className="h-14 w-14 text-muted-foreground" />

            <h1 className="text-3xl font-bold">
                Ask PlaceNet AI anything
            </h1>

            <p className="max-w-md text-muted-foreground">
                Search resumes, analyze candidates,
                generate interview questions, and more.
            </p>

        </div>
    );
}
