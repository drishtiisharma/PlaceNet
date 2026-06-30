"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function DepartmentDistribution() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>
                    Resume distribution across academic departments.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Bar Chart goes here */}
                <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Department Bar Chart
                </div>
            </CardContent>
        </Card>
    );
}