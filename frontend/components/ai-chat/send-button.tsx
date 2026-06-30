"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type SendButtonProps = {
    disabled?: boolean;
    onClick?: () => void;
};

export function SendButton({
    disabled,
    onClick,
}: SendButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className="bg-orange-600 hover:bg-blue-600 text-white"
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>

            </TooltipTrigger>

            <TooltipContent>
                <p>Send message</p>
            </TooltipContent>
        </Tooltip>
    );
}