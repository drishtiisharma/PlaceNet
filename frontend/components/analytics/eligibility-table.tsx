"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function EligibilityTable({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Eligible Candidates by Profile</CardTitle>
                <CardDescription>
                    Number of candidates strictly meeting requirements for active hiring profiles.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="h-[300px] overflow-auto">
                    {data && data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hiring Profile</TableHead>
                                    <TableHead className="text-right">Eligible Candidates</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{row.job_title}</TableCell>
                                        <TableCell className="text-right">{row.eligible_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No hiring profiles configured
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
