"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DepartmentDistribution } from "@/components/analytics/department-distribution";
import { TopSkills } from "@/components/analytics/top-skills";
import { UploadTrends } from "@/components/analytics/upload-trends";
import { EligibilityTable } from "@/components/analytics/eligibility-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, GraduationCap, CheckCircle } from "lucide-react";

export default function DashboardPage() {
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
                <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of all candidate and placement metrics.</p>
            </div>
            
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_resumes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Hiring Profiles</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_hiring_profiles}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.average_cgpa}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Shortlisted Candidates</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_shortlisted}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DepartmentDistribution data={data.department_distribution} />
                <TopSkills data={data.top_skills} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <UploadTrends data={data.upload_trends} />
                <EligibilityTable data={data.eligibility_stats} />
            </div>
        </div>
    );
}