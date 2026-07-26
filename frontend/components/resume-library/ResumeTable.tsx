"use client";

import { useEffect, useState } from "react";
import { ResumeSkeleton } from "./ResumeSkeleton";
import { fetchApi } from "@/lib/api";
import { ResumeRow } from "./ResumeRow";

type Resume = {
    resume_id: string;
    full_name: string;
    original_filename: string;
    resume_path: string;
};

export function ResumeTable({ query }: { query?: string }) {

    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {

        async function loadResumes() {
            setLoading(true);
            try {
                let response;
                if (query && query.trim() !== "") {
                    response = await fetchApi("/search/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query: query, top_k: 10 })
                    });
                } else {
                    response = await fetchApi("/resume/library");
                }

                const data = await response.json();
                setResumes(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadResumes();

    }, [query]);

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
