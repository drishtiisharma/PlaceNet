"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { RankingResult } from "./candidates-context";
import { CheckCircle2, Download, ExternalLink, XCircle } from "lucide-react";
import { cleanCandidateName } from "./columns";

// Helper for avatar initials
function getInitials(name: string) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface CandidateSheetProps {
    children: React.ReactNode;
    candidate?: RankingResult;
}

export function CandidateSheet({
    children,
    candidate
}: CandidateSheetProps) {
    if (!candidate) {
        return <>{children}</>;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent className="sm:max-w-[550px] w-full flex flex-col h-[100dvh] p-0">
                <div className="p-6 pb-4 border-b shrink-0 bg-background z-10">
                    <SheetHeader>
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xl shadow-sm">
                                {getInitials(cleanCandidateName(candidate.candidate_name))}
                            </div>
                            <div className="flex flex-col items-start pr-6">
                                <SheetTitle className="text-2xl font-bold">{cleanCandidateName(candidate.candidate_name)}</SheetTitle>
                                <SheetDescription className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                                        Score: {candidate.match_score} / 100
                                    </Badge>
                                    <Badge variant="outline">Rank #{candidate.ranking_position}</Badge>
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Candidate Profile
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border shadow-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase">Branch</span>
                                <span className="font-medium">{candidate.department || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase">CGPA</span>
                                <span className="font-medium">{candidate.cgpa || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* AI Fitment Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            AI Fitment Summary
                        </h3>
                        <div className="bg-card border p-4 rounded-lg shadow-sm">
                            <p className="text-sm leading-relaxed text-card-foreground">
                                {candidate.ai_summary}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Why this score? */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                            Why this score?
                        </h3>
                        <p className="text-sm bg-orange-50 p-4 rounded-lg text-orange-900 border border-orange-200 leading-relaxed shadow-sm">
                            {candidate.why_this_score}
                        </p>
                    </div>

                    <Separator />

                    {/* AI Analysis (Strengths, Weaknesses, Recommendations) */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-600 flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Strengths
                            </h3>
                            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                                {candidate.strengths?.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-500 flex items-center">
                                <XCircle className="mr-2 h-4 w-4" /> Weaknesses
                            </h3>
                            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                                {candidate.weaknesses?.map(w => <li key={w}>{w}</li>)}
                            </ul>
                        </div>
                    </div>
                    
                    {candidate.recommendations && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Recommendations
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {candidate.recommendations}
                            </p>
                        </div>
                    )}

                    <Separator />

                    {/* Structured Details */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Structured Details
                        </h3>

                        {candidate.skills?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-semibold">Parsed Skills</span>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                </div>
                            </div>
                        )}

                        {candidate.education?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-semibold">Education</span>
                                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                                    {candidate.education.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {candidate.experience?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-semibold">Experience</span>
                                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                                    {candidate.experience.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {candidate.projects?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-semibold">Projects</span>
                                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                                    {candidate.projects.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        )}
                        
                        {candidate.certifications?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-semibold">Certifications</span>
                                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                                    {candidate.certifications.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => window.open(`http://127.0.0.1:8000/resume/view/${candidate.resume_id}`, "_blank")}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Resume
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}