"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ActionRequired({ data }: { data: any }) {
    if (!data) return null;

    return (
        <Card className="h-full border-red-200 bg-red-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Action Required
                </CardTitle>
                <CardDescription className="text-red-600/80">
                    Candidates missing critical information or having low match scores.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-red-100">
                        <span className="text-sm font-medium text-gray-700">Missing Contact Info</span>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {data.missing_contact ?? 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-red-100">
                        <span className="text-sm font-medium text-gray-700">Missing GitHub Link</span>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {data.missing_github ?? 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-red-100">
                        <span className="text-sm font-medium text-gray-700">Missing Projects</span>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {data.missing_projects ?? 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-red-100">
                        <span className="text-sm font-medium text-gray-700">Parsing Failures</span>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {data.parsing_failures ?? 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-red-100">
                        <span className="text-sm font-medium text-gray-700">Below 50% Match Score</span>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {data.below_50_match ?? 0}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
