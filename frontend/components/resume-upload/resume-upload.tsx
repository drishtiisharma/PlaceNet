"use client";
const BACKEND_URL = "http://127.0.0.1:8000";
import {
    Dropzone,
    DropZoneArea,
    DropzoneDescription,
    DropzoneFileList,
    DropzoneFileListItem,
    DropzoneMessage,
    DropzoneRemoveFile,
    DropzoneTrigger,
    useDropzone,
} from "@/components/ui/dropzone";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import {
    FileText,
    FileSpreadsheet,
    FileImage,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import { CircleFadingArrowUpIcon } from "lucide-react";


import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ResumeUpload() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadSuccessResult, setUploadSuccessResult] = useState<{ 
        processed_resumes: number, 
        total_uploaded: number,
        failed_count: number,
        failures: { filename: string, reason: string }[] 
    } | null>(null);

    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
                status: "success",
                result: URL.createObjectURL(file),
            };
        },
        validation: {
            accept: {
                "application/pdf": [".pdf"],
                "application/msword": [".doc"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            },
            maxSize: 10 * 1024 * 1024,
        },
    });

    const handleProcessResumes = async () => {
        try {
            const formData = new FormData();

            // Collect all uploaded files
            const uploadedFiles = dropzone.fileStatuses
                .filter((file) => file.status === "success")
                .map((file) => file.file);

            if (uploadedFiles.length === 0) {
                toast.error("Please upload at least one resume.");
                return;
            }

            uploadedFiles.forEach((file) => {
                formData.append("files", file);
            });

            setIsProcessing(true);
            const processingToastId = toast.loading(`Processing resumes... 0/${uploadedFiles.length} processed`);

            const response = await fetchApi("/resume/process", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                toast.dismiss(processingToastId);
                const errorMessage = errorData.detail || "Failed to process resumes.";
                toast.error(`Backend Error: ${errorMessage}`);
                setIsProcessing(false);
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");

            if (!reader) {
                throw new Error("Response body is not readable");
            }

            let result = null;
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.substring(6);
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.type === "progress") {
                                toast.loading(`Processing resumes... ${data.processed + data.failed}/${data.total} processed`, {
                                    id: processingToastId
                                });
                            } else if (data.type === "complete") {
                                result = data.result;
                            } else if (data.type === "error") {
                                throw new Error(data.detail);
                            }
                        } catch (e) {
                            console.error("Error parsing SSE data", e);
                        }
                    }
                }
            }

            toast.dismiss(processingToastId);

            if (!result) {
                throw new Error("Did not receive complete result from server.");
            }

            if (result.status === "success" || result.status === "partial_success") {
                if (result.processed_resumes > 0) {
                    if (result.status === "success") {
                        toast.success(`${result.processed_resumes} resume(s) processed successfully!`);
                    }
                    setUploadSuccessResult({ 
                        processed_resumes: result.processed_resumes,
                        total_uploaded: result.total_uploaded || result.processed_resumes,
                        failed_count: result.failed_count || 0,
                        failures: result.failures || []
                    });
                } else {
                    toast.error(
                        `${result.failed_count} of ${result.total_uploaded} resumes could not be processed.`,
                        {
                            description: (result.failures || []).map((f: any) => `${f.filename}: ${f.reason}`).join("\n")
                        }
                    );
                }
            } else {
                toast.error(
                    `${result.failed_count} of ${result.total_uploaded} resumes could not be processed.`,
                    {
                        description: (result.failures || []).map((f: any) => `${f.filename}: ${f.reason}`).join("\n")
                    }
                );
            }

            setIsProcessing(false);
        } catch (error: any) {
            toast.dismiss();
            toast.error(`Something went wrong while processing resumes: ${error.message}`);
            setIsProcessing(false);
        }
    };

    const resetUpload = () => {
        setUploadSuccessResult(null);
        // We can force dropzone to clear by a simple window reload, 
        // but better to just let user refresh or we can try to clear statuses.
        // For now, if we unmount the dropzone in the conditional render, 
        // it might reset its state.
    };

    return (
        <div className="not-prose flex flex-col gap-4">
            <AnimatePresence mode="wait">
                {uploadSuccessResult ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl shadow-sm border text-center"
                    >
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Upload Successful!</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Your resumes have been uploaded successfully and are ready for AI processing.
                        </p>
                        
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none mb-8 px-4 py-1.5 text-sm">
                            {uploadSuccessResult.processed_resumes} of {uploadSuccessResult.total_uploaded} resumes uploaded successfully
                        </Badge>

                        {uploadSuccessResult.failed_count > 0 && (
                            <div className="mb-8 w-full max-w-md text-left bg-red-50 border border-red-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-800 font-semibold mb-3">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{uploadSuccessResult.failed_count} resume(s) could not be processed</span>
                                </div>
                                <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                                    {uploadSuccessResult.failures.map((failure, idx) => (
                                        <div key={idx} className="bg-white/60 p-2 rounded text-sm text-red-900 shadow-sm">
                                            <span className="font-medium">{failure.filename}</span>
                                            <span className="text-red-700 ml-2">— {failure.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button 
                                variant="outline" 
                                onClick={resetUpload}
                                className="h-11 px-6"
                            >
                                Upload More
                            </Button>
                            <Link href="/dashboard/resume-library">
                                <Button className="h-11 bg-orange-600 hover:bg-orange-700 text-white px-6">
                                    View Resume Library <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="mb-6 flex justify-end">
                            <Button
                                onClick={handleProcessResumes}
                                disabled={isProcessing}
                                className="h-11 bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                <CircleFadingArrowUpIcon className="mr-1 h-4 w-4" />
                                {isProcessing ? "Processing..." : "Process Resumes"}
                            </Button>
                        </div>
                        <Dropzone {...dropzone}>

                <div>

                    <DropZoneArea>
                        <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                            <CloudUploadIcon className="size-8" />
                            <div>
                                <p className="font-semibold">Upload Resumes</p>
                                <p className="text-sm text-muted-foreground">
                                    Click here or drag and drop to upload
                                </p>
                            </div>
                        </DropzoneTrigger>
                    </DropZoneArea>
                </div>

                <DropzoneFileList className="grid gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
                    {dropzone.fileStatuses.map((file) => (
                        <DropzoneFileListItem
                            className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                            key={file.id}
                            file={file}
                        >
                            {file.status === "pending" && (
                                <div className="aspect-video animate-pulse bg-black/20" />
                            )}

                            {file.status === "success" && (
                                <>
                                    {(() => {
                                        const type = file.file.type;

                                        return (
                                            <div className="flex aspect-video items-center justify-center bg-muted">
                                                {type === "application/pdf" ? (
                                                    <FileText className="h-16 w-16 text-red-500" />
                                                ) : type ===
                                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                                                    <FileText className="h-16 w-16 text-blue-500" />
                                                ) : (
                                                    <FileImage className="h-16 w-16 text-gray-500" />
                                                )}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}

                            <div className="flex items-center justify-between p-2 pl-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm">{file.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>

                                <DropzoneRemoveFile
                                    variant="ghost"
                                    className="shrink-0 hover:outline"
                                >
                                    <Trash2Icon className="size-4" />
                                </DropzoneRemoveFile>
                            </div>
                        </DropzoneFileListItem>
                    ))}
                </DropzoneFileList>
            </Dropzone>
            </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
