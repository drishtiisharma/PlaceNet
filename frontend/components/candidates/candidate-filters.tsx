"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCandidates } from "./candidates-context";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

export function CandidateFilters() {
    const { 
        hiringProfiles, selectedProfile, 
        filters, setFilters, isLoading, setIsLoading, fetchCandidates 
    } = useCandidates();

    const selectedHp = hiringProfiles.find(p => p.id === selectedProfile);

    // Combine skills and remove duplicates
    const availableSkills = selectedHp 
        ? Array.from(new Set([...(selectedHp.required_skills || []), ...(selectedHp.preferred_skills || [])]))
        : [];
        
    const availableBranches = selectedHp ? (selectedHp.eligible_departments || []) : [];
    
    const handleRankCandidates = async () => {
        if (!selectedProfile) {
            toast.error("Please select a Hiring Profile first.");
            return;
        }

        setIsLoading(true);
        let toastId = toast.loading("Starting ranking process...");

        try {
            const res = await fetchApi(`/ranking/${selectedProfile}/process`, {
                method: "POST"
            });

            if (!res.ok) {
                throw new Error("Failed to start ranking process.");
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder("utf-8");

            if (!reader) {
                throw new Error("Failed to read response stream.");
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");
                
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.type === "progress") {
                                toast.loading(`Ranking candidates... ${data.processed}/${data.total}`, { id: toastId });
                            } else if (data.type === "complete") {
                                toast.success("Candidates successfully ranked!", { id: toastId });
                            } else if (data.type === "error") {
                                toast.error(`Error: ${data.detail}`, { id: toastId });
                            }
                        } catch (e) {
                            console.error("Failed to parse SSE data", e);
                        }
                    }
                }
            }

            // After process is complete, fetch the first page from results
            await fetchCandidates(1);

        } catch (err) {
            toast.error("An error occurred during ranking.", { id: toastId });
            console.error("Error during ranking:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <Select value={filters.skill} onValueChange={(v) => setFilters({ ...filters, skill: v })}>
                    <SelectTrigger className="w-[160px] truncate" disabled={!selectedProfile}>
                        <div className="truncate w-full text-left"><SelectValue placeholder="Skills" /></div>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-64">
                        <SelectItem value="all">All Skills</SelectItem>
                        {availableSkills.map((s: string) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filters.cgpa} onValueChange={(v) => setFilters({ ...filters, cgpa: v })}>
                    <SelectTrigger className="w-[120px]" disabled={!selectedProfile}>
                        <div className="truncate w-full text-left"><SelectValue placeholder="CGPA" /></div>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="all">Any CGPA</SelectItem>
                        <SelectItem value="9">9+</SelectItem>
                        <SelectItem value="8">8+</SelectItem>
                        <SelectItem value="7">7+</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.year} onValueChange={(v) => setFilters({ ...filters, year: v })}>
                    <SelectTrigger className="w-[120px]" disabled={!selectedProfile}>
                        <div className="truncate w-full text-left"><SelectValue placeholder="Year" /></div>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="all">Any Year</SelectItem>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.branch} onValueChange={(v) => setFilters({ ...filters, branch: v })}>
                    <SelectTrigger className="w-[150px] truncate" disabled={!selectedProfile}>
                        <div className="truncate w-full text-left"><SelectValue placeholder="Branch" /></div>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-64">
                        <SelectItem value="all">Any Branch</SelectItem>
                        {availableBranches.map((b: string) => (
                            <SelectItem key={b} value={b} className="truncate">{b}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button 
                onClick={handleRankCandidates} 
                disabled={!selectedProfile || isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Rank Candidates
            </Button>
        </div>
    );
}
