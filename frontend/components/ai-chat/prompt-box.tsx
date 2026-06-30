"use client";

import { useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { AttachmentButton } from "./attachment-button";
import { SendButton } from "./send-button";
import { UploadedFile } from "./uploaded-file";

export function PromptBox() {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    return (
        <div className="w-full max-w-3xl rounded-3xl border bg-background p-4 shadow-sm">

            {file && (
                <div className="mb-3">
                    <UploadedFile
                        fileName={file.name}
                        onRemove={() => setFile(null)}
                    />
                </div>
            )}

            <Textarea
                placeholder="Ask PlaceNet AI anything..."
                className="min-h-[30px] resize-none border-0 shadow-none focus-visible:ring-0"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className="mt-4 flex items-center justify-between">

                <AttachmentButton
                    onClick={() => fileInputRef.current?.click()}
                />

                <SendButton
                    disabled={!message.trim()}
                />

            </div>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
            />

        </div>
    );
}