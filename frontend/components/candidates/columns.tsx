"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileText } from "lucide-react";
import { CandidateActions } from "./candidate-actions";

export type Candidate = {
    id: number;
    name: string;
    phone: string;
    resume: string;
    score: number | null;
};

export const columns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "id",
        header: "S.No",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "resume",
        header: "Resume",
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                >
                    <FileText className="h-4 w-4" />
                    View
                </Button>
            );
        },
    },
    {
        accessorKey: "score",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    AI Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const score = row.original.score;

            return (
                <span className="font-medium">
                    {score ?? "--"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            return <CandidateActions candidate={row.original} />;
        },
    },
];