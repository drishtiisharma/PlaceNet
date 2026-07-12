"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileText, CheckCircle2, XCircle } from "lucide-react";
import { CandidateActions } from "./candidate-actions";
import { RankingResult } from "./candidates-context";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useResumeViewer } from "@/components/resume-viewer/resume-viewer-context";

// We create a wrapper component for the cell to use hooks
const ResumeCell = ({ resumeId }: { resumeId: string }) => {
    const { openResume } = useResumeViewer();
    return (
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => openResume(resumeId)}>
            <FileText className="h-4 w-4" />
            View
        </Button>
    );
};

export const columns: ColumnDef<RankingResult>[] = [
    {
        accessorKey: "ranking_position",
        header: "Rank",
        cell: ({ row }) => <span className="font-bold">#{row.original.ranking_position}</span>
    },
    {
        accessorKey: "candidate_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "match_score",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    AI Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const score = row.original.match_score;
            return <span className="font-medium text-orange-600">{score ?? "--"} / 100</span>;
        },
    },
    {
        id: "skills",
        header: "Skills Match",
        cell: ({ row }) => {
            const { matched_skills, missing_skills } = row.original;
            return (
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> {matched_skills.length}
                    </span>
                    <span className="flex items-center text-red-500">
                        <XCircle className="h-3 w-3 mr-1" /> {missing_skills.length}
                    </span>
                </div>
            );
        }
    },
    {
        id: "explanation",
        header: "AI Summary",
        cell: ({ row }) => {
            const explanation = row.original.explanation;
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link" size="sm">View</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-sm">
                        {explanation}
                    </PopoverContent>
                </Popover>
            );
        }
    },
    {
        accessorKey: "resume",
        header: "Resume",
        cell: ({ row }) => <ResumeCell resumeId={row.original.resume_id} />
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            return <CandidateActions candidate={row.original as any} />;
        },
    },
];