"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatDropdown() {
    return (
        <Button
            variant="ghost"
            className="mb-20 gap-2 text-lg font-semibold"
        >
            AI Chat

            <ChevronDown className="h-4 w-4" />
        </Button>
    );
}