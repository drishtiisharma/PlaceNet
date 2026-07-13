"use client";

import { FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type UploadedFileProps = {
    fileName: string;
    onRemove?: () => void;
};

export function UploadedFile({
    fileName,
    onRemove,
}: UploadedFileProps) {
    return (
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{fileName}</span>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
