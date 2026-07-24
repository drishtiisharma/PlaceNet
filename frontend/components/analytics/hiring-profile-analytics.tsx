"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, TrendingDown, Users } from "lucide-react";

export function HiringProfileAnalytics({ data }: { data: any }) {
    if (!data) return null;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Hiring Profile Analytics</CardTitle>
                <CardDescription>Match statistics across all evaluated profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Candidates Ranked</p>
                            <h3 className="text-2xl font-bold">{data.candidates_ranked ?? 0}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <Target className="h-8 w-8 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Average Match</p>
                            <h3 className="text-2xl font-bold">{data.average_match ?? 0}%</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Highest Match</p>
                            <h3 className="text-2xl font-bold">{data.highest_match ?? 0}%</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <TrendingDown className="h-8 w-8 text-orange-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Lowest Match</p>
                            <h3 className="text-2xl font-bold">{data.lowest_match ?? 0}%</h3>
                        </div>
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium">Match Breakdown</h4>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">&gt; 80% Match</span>
                        <span className="font-bold">{data.count_gt_80 ?? 0} Candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">50% - 80% Match</span>
                        <span className="font-bold">{data.count_50_80 ?? 0} Candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">&lt; 50% Match</span>
                        <span className="font-bold">{data.count_lt_50 ?? 0} Candidates</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
