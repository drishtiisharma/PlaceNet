"use client";

import { useEffect, useState } from "react";
import { DepartmentDistribution } from "@/components/analytics/department-distribution";
import { TopSkills } from "@/components/analytics/top-skills";
import { ReportPreview } from "@/components/analytics/report-preview";
import { MetricsCards } from "@/components/analytics/metrics-cards";
import { QualityDistribution } from "@/components/analytics/quality-distribution";
import { SkillsCategories } from "@/components/analytics/skills-categories";
import { HiringProfileAnalytics } from "@/components/analytics/hiring-profile-analytics";
import { ActionRequired } from "@/components/analytics/action-required";
import { AIInsights } from "@/components/analytics/ai-insights";

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

            <MetricsCards data={data} />
            
            <AIInsights insights={data.ai_insights} />

            <div className="grid gap-6 lg:grid-cols-2">
                <HiringProfileAnalytics data={data.hiring_profile_analytics} />
                <ActionRequired data={data.action_required} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <QualityDistribution data={data.resume_quality_distribution} />
                <SkillsCategories data={data.skills_categories} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <DepartmentDistribution data={data.department_distribution} />
                <TopSkills data={data.top_skills} allSkills={data.all_skills} />
            </div>

            <ReportPreview hiringProfiles={data.hiring_profiles_list} />
        </div>
    );
}