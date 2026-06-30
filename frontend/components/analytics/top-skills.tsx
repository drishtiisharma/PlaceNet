"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function TopSkills() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Skills</CardTitle>
                <CardDescription>
                    Most frequently occurring skills in uploaded resumes.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Horizontal Bar Chart goes here */}
                <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Top Skills Chart
                </div>
            </CardContent>
        </Card>
    );
}