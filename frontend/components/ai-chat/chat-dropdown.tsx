"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatDropdown() {
    return (
        <Button
            variant="ghost"
            className="gap-2 text-lg font-semibold"
        >
            Chats

            <ChevronDown className="h-4 w-4" />
        </Button>
    );
}