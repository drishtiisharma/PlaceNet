"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeDataTable } from "../../../components/resume-library/ResumeDataTable";

export default function ResumeLibraryPage() {
    return (
        <div className="p-6">
            <h1 className="mb-10 text-3xl font-bold">
                Resume Library
            </h1>
            <Card>
                <CardHeader>
                    <p className="text-sm text-muted-foreground">
                        View and manage all uploaded resumes.
                    </p>
                </CardHeader>

                <CardContent>
                    <ResumeDataTable />
                </CardContent>
            </Card>
        </div>
    );
}