"use client";
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
    FileImage,
} from "lucide-react";

interface UploadAreaProps {
    onFileDrop?: (file: File) => void;
}

export function UploadArea({ onFileDrop }: UploadAreaProps) {
    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            if (onFileDrop) {
                onFileDrop(file);
            }
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

    return (
        <div className="not-prose flex flex-col gap-4">
            <Dropzone {...dropzone}>
                <div>
                    <DropZoneArea>
                        <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                            <CloudUploadIcon className="size-8" />
                            <div>
                                <p className="font-semibold">
                                    Upload Supporting Files
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Upload PDFs, DOCX files, or other documents related to this job description.
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
        </div>
    );
}