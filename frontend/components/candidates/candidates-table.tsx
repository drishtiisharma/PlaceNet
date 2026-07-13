"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { columns } from "./columns";
import { CandidatesSkeleton } from "./candidates-skeleton";
import { useCandidates, RankingResult } from "./candidates-context";

export function CandidatesTable() {
    const { rankedCandidates, isLoading, searchQuery, filters } = useCandidates();
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const filteredCandidates = React.useMemo(() => {
        let result = rankedCandidates;

        // Search Query
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            result = result.filter(c => 
                c.full_name?.toLowerCase().includes(q) ||
                c.skills?.some(s => s.toLowerCase().includes(q)) ||
                c.experience?.some(e => e.toLowerCase().includes(q)) ||
                c.projects?.some(p => p.toLowerCase().includes(q))
            );
        }

        // Filters
        if (filters.skill && filters.skill !== "all") {
            result = result.filter(c => c.skills?.some(s => s.toLowerCase() === filters.skill.toLowerCase()));
        }
        if (filters.cgpa && filters.cgpa !== "all") {
            const target = Number(filters.cgpa);
            result = result.filter(c => c.cgpa && Number(c.cgpa) >= target);
        }
        if (filters.branch && filters.branch !== "all") {
            result = result.filter(c => c.department?.toLowerCase() === filters.branch.toLowerCase());
        }
        
        // Note: Year filter logic would require extraction from education. 
        // We'll skip for now if it's complex, or implement basic logic.

        return result;
    }, [rankedCandidates, searchQuery, filters]);

    const table = useReactTable({
        data: filteredCandidates,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) {
        return <CandidatesSkeleton />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50 transition-colors group">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4 align-middle">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No candidates ranked yet. Select a hiring profile and click Rank Candidates!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
