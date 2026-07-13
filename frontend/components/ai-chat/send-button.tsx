"use client";

import { ArrowUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type SendButtonProps = {
    disabled?: boolean;
    onClick?: () => void;
    isLoading?: boolean;
};

export function SendButton({
    disabled,
    onClick,
    isLoading,
}: SendButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    onClick={onClick}
                    disabled={disabled || isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                </Button>

            </TooltipTrigger>

            <TooltipContent>
                <p>Send message</p>
            </TooltipContent>
        </Tooltip>
    );
}
