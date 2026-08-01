"use client";

import { toast } from "sonner";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { UploadArea } from "./upload-area";
import { HiringProfileForm, HiringProfileData } from "./hiring-profile-form";

export function AIAutofillPanel({ onSuccess }: { onSuccess?: () => void }) {
    const [parsedData, setParsedData] = useState<HiringProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rawText, setRawText] = useState("");

    const handleUploadComplete = async (file: File) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetchApi("/hiring-profile/parse", {
                method: "POST",
                body: formData,
            });
            
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                toast.error(err.detail || err.message || "Failed to parse Job Description.");
                return;
            }
            const data = await response.json();
            console.log("Parser API Response:", data);
            
            const parsed = data.success !== undefined ? data.data : data;

            toast.success("Successfully extracted information!");
            console.log("Setting frontend parsed state:", parsed);
            setParsedData(parsed);
        } catch (error) {
            console.error("AI Autofill Error:", error);
            toast.error("An unexpected error occurred while parsing.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoFillText = () => {
        if (!rawText.trim()) {
            toast.warning("Please paste a Job Description first.");
            return;
        }
        const file = new File([rawText], "jd.txt", { type: "text/plain" });
        handleUploadComplete(file);
    };

    return (
        <div className="space-y-6">
            {!parsedData ? (
                <>
                    <Field>
                        <FieldLabel>Paste Job Description</FieldLabel>
                        <FieldDescription>
                            Paste the complete Job Description below.
                        </FieldDescription>
                        <Textarea
                            rows={10}
                            placeholder="Paste the Job Description here..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                    </Field>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                                OR
                            </span>
                        </div>
                    </div>

                    <UploadArea onFileDrop={handleUploadComplete} />

                    <div className="mt-6 flex justify-center">
                        <Button 
                            className="h-11 w-full bg-orange-600 hover:bg-blue-600 text-white" 
                            disabled={isLoading}
                            onClick={handleAutoFillText}
                        >
                            {isLoading ? "Generating..." : "AutoFill Details"}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Review Parsed Data</h3>
                        <Button variant="outline" onClick={() => setParsedData(null)}>
                            Reset
                        </Button>
                    </div>
                    <HiringProfileForm initialData={parsedData} onSuccess={onSuccess} />
                </>
            )}
        </div>
    );
}
