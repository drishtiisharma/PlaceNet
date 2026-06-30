import { DepartmentDistribution } from "@/components/analytics/department-distribution";
import { TopSkills } from "@/components/analytics/top-skills";
import { ReportPreview } from "@/components/analytics/report-preview";

export default function AnalyticsPage() {
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
                <DepartmentDistribution />
                <TopSkills />
            </div>

            <ReportPreview />
        </div>
    );
}