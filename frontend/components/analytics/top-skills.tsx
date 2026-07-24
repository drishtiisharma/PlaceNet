"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function TopSkills({ data, allSkills }: { data: any[], allSkills?: any[] }) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-white p-3 border shadow-sm rounded-md text-sm">
                    <p className="font-semibold">{dataPoint.name}</p>
                    <p className="text-gray-600">Count: {dataPoint.value}</p>
                    <p className="text-gray-600">Percentage: {dataPoint.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>Top Skills</CardTitle>
                    <CardDescription className="mt-1">
                        Most frequently occurring skills in uploaded resumes.
                    </CardDescription>
                </div>
                {allSkills && allSkills.length > 0 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View All</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>All Parsed Skills</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                                {allSkills.map((skill, i) => (
                                    <div key={i} className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm">
                                        <span className="font-medium truncate mr-2" title={skill.name}>{skill.name}</span>
                                        <span className="text-muted-foreground whitespace-nowrap">{skill.percentage}% ({skill.value})</span>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>

            <CardContent>
                <div className="h-[300px] mt-4">
                    {data && data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="percentage" fill="#f97316" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
