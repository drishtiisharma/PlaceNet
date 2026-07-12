"use client";

import { useEffect, useState } from "react";
import { DepartmentDistribution } from "@/components/analytics/department-distribution";
import { TopSkills } from "@/components/analytics/top-skills";
import { ReportPreview } from "@/components/analytics/report-preview";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/analytics/dashboard")
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err));
    }, []);

    if (!data) {
        return <div className="flex h-[100vh] items-center justify-center">Loading Analytics...</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Analytics
                </h1>
                <p className="text-muted-foreground">
                    Gain insights into student resumes and export detailed reports.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <DepartmentDistribution data={data.department_distribution} />
                <TopSkills data={data.top_skills} />
            </div>

            <ReportPreview />
        </div>
    );
}