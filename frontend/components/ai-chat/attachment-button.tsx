"use client";

import { Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type AttachmentButtonProps = {
    onClick?: () => void;
};

export function AttachmentButton({
    onClick,
}: AttachmentButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <Paperclip className="h-5 w-5 text-orange-600" />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                <p>Attach file</p>
            </TooltipContent>
        </Tooltip>
    );
}
