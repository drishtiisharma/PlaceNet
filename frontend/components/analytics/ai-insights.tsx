"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function AIInsights({ insights }: { insights: string[] }) {
    if (!insights || insights.length === 0) return null;

    return (
        <Card className="col-span-full bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    AI Recruiter Insights
                </CardTitle>
                <CardDescription className="text-indigo-700/70">
                    Automated observations based on aggregated candidate metrics.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="grid gap-3 md:grid-cols-2">
                    {insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-indigo-950 bg-white/60 p-3 rounded-md border border-indigo-100/50">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                            <span>{insight}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
