"use client";

import { FileText } from "lucide-react";
import { ResumeActions } from "./ResumeActions";

type Resume = {
    resume_id: string;
    full_name: string;
    original_filename: string;
    resume_path: string;
};

export function ResumeRow({
    resume,
}: {
    resume: Resume;
}) {
    return (
        <div className="grid grid-cols-5 items-center gap-6 rounded-lg border p-4">

            <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-orange-600" />

                <div>
                    <p className="font-medium">
                        {resume.full_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {resume.original_filename}
                    </p>
                </div>
            </div>

            <p>-</p>

            <p>-</p>

            <p className="text-sm text-muted-foreground">
                Indexed
            </p>

            <div className="flex justify-end">
                <ResumeActions
                    resumeId={resume.resume_id}
                />
            </div>

        </div>
    );
}
