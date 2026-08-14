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
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await fetchApi("/analytics/dashboard");
                if (res.status === 401 || res.status === 403) {
                    setError("Session expired. Please log in again.");
                    toast.error("Session expired. Please log in again.");
                    return;
                }
                if (!res.ok) {
                    throw new Error("Failed to load analytics");
                }
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard analytics");
                toast.error("Failed to load dashboard analytics");
            } finally {
                setLoading(false);
            }
        };
        
        loadDashboard();
    }, []);

    if (loading) {
        return <div className="flex h-[100vh] items-center justify-center text-muted-foreground">Loading Analytics...</div>;
    }

    if (error || !data) {
        return <div className="flex h-[100vh] items-center justify-center text-red-500">{error || "Failed to load data"}</div>;
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