"use client";

import { useEffect, useState } from "react";
import { ResumeSkeleton } from "./ResumeSkeleton";
import { ResumeRow } from "./ResumeRow";

type Resume = {
    resume_id: string;
    candidate_name: string;
    original_filename: string;
    resume_path: string;
};

export function ResumeTable() {

    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {

        async function loadResumes() {

            try {

                const response = await fetch(
                    "http://localhost:8000/resume/library"
                );

                const data = await response.json();

                setResumes(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        }

        loadResumes();

    }, []);

    if (loading) {
        return <ResumeSkeleton />;
    }

    if (resumes.length === 0) {
        return (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
                No resumes uploaded yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {resumes.map((resume) => (
                <ResumeRow
                    key={resume.resume_id}
                    resume={resume}
                />
            ))}
        </div>
    );
}