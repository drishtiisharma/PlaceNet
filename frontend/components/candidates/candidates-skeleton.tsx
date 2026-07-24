"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function CandidatesSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>AI Score</TableHead>
                        <TableHead>Skills Match</TableHead>
                        <TableHead>AI Summary</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-4 w-6" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-4 w-36" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-4 w-32" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-9 w-20 rounded-md" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-4 w-12" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-4 w-12" />
                            </TableCell>

                            <TableCell className="text-right">
                                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
