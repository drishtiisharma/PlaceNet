"use client";

import { Separator } from "@/components/ui/separator";

export function CandidatesHeader() {
    return (
        <div className="space-y-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    List of Candidates
                </h1>

                <p className="text-sm text-muted-foreground">
                    Search, filter, and rank candidates based on AI-powered resume analysis.
                </p>
            </div>

            <Separator />
        </div>
    );
}