"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileText, CheckCircle2, XCircle } from "lucide-react";
import { CandidateActions } from "./candidate-actions";
import { RankingResult } from "./candidates-context";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api";

export function cleanCandidateName(rawName: string) {
    if (!rawName) return "Unknown Candidate";
    let cleaned = rawName.replace(/_/g, " ").replace(/-/g, " ");
    cleaned = cleaned.replace(/\b(resume|cv|final|copy|v\d+)\b/gi, "");
    cleaned = cleaned.replace(/[()\[\]0-9]/g, "");
    cleaned = cleaned.trim().replace(/\s+/g, " ");
    return cleaned || "Unknown Candidate";
}

const ResumeCell = ({ resumeId }: { resumeId: string }) => {
    return (
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={async () => {
            const newWindow = window.open('about:blank', '_blank');
            try {
                const res = await fetchApi(`/resume/view/${resumeId}`);
                if (res.status === 401 || res.status === 403) {
                    newWindow?.close();
                    return;
                }
                if (!res.ok) throw new Error("Failed to view");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                if (newWindow) newWindow.location.href = url;
                else window.location.href = url;
            } catch (e) {
                newWindow?.close();
                console.error(e);
            }
        }}>
            <FileText className="h-4 w-4 text-blue-500" />
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
        accessorKey: "full_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <span className="font-medium text-foreground">{cleanCandidateName(row.original.full_name)}</span>
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
            return <Badge variant="secondary" className="font-semibold text-orange-600 bg-orange-50 border-orange-200">{score ?? "--"} / 100</Badge>;
        },
    },
    {
        id: "skills",
        header: "Skills Match",
        cell: ({ row }) => {
            const {
                matched_skills, missing_skills, preferred_skills_present,
                missing_requirements, additional_relevant_skills, ai_summary
            } = row.original;

            const isFailed = ai_summary?.includes("Summary could not be generated");

            // Note: Skills match is computed deterministically, so we always show it 
            // even if the LLM AI Summary fails. We do not exit early.

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed shadow-sm">
                            <span className="flex items-center text-green-600 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {matched_skills?.length || 0}
                            </span>
                            <span className="flex items-center text-red-500 font-medium">
                                <XCircle className="h-3.5 w-3.5 mr-1" /> {missing_skills?.length || 0}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-4 text-sm space-y-4">
                        <div>
                            <h4 className="font-semibold text-green-600 mb-1">Matched Required Skills ({matched_skills?.length || 0})</h4>
                            <div className="flex flex-wrap gap-1">
                                {matched_skills?.map(s => <span key={s} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">{s}</span>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-600 mb-1">Missing Required Skills ({missing_skills?.length || 0})</h4>
                            <div className="flex flex-wrap gap-1">
                                {missing_skills?.map(s => <span key={s} className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">{s}</span>)}
                            </div>
                        </div>
                        {preferred_skills_present?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-blue-600 mb-1">Preferred Skills Present ({preferred_skills_present.length})</h4>
                                <div className="flex flex-wrap gap-1">
                                    {preferred_skills_present.map(s => <span key={s} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{s}</span>)}
                                </div>
                            </div>
                        )}
                        {additional_relevant_skills?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-purple-600 mb-1">Additional Relevant Skills ({additional_relevant_skills.length})</h4>
                                <div className="flex flex-wrap gap-1">
                                    {additional_relevant_skills.map(s => <span key={s} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">{s}</span>)}
                                </div>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            );
        }
    },
    {
        id: "ai_summary",
        header: "AI Summary",
        cell: ({ row }) => {
            const summary = row.original.ai_summary;
            const isFailed = summary?.includes("Summary could not be generated");

            if (isFailed) {
                return <span className="text-xs text-muted-foreground italic">Unavailable</span>;
            }

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link" size="sm" className="text-orange-600">View</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 text-sm shadow-md">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-orange-600">Fitment Summary</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {summary || "No summary available."}
                            </p>
                        </div>
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
        header: "Actions",
        cell: ({ row }) => {
            return <CandidateActions candidate={row.original as any} />;
        },
    },
];
