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

export function CandidateFilters() {
    const { 
        hiringProfiles, selectedProfile, 
        filters, setFilters, isLoading, setIsLoading, setRankedCandidates 
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
        try {
            const res = await fetch(`http://127.0.0.1:8000/ranking/${selectedProfile}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ top_k: 20 }) // Defaulting to 20
            });

            if (res.ok) {
                const data = await res.json();
                setRankedCandidates(data);
                toast.success("Candidates successfully ranked!");
            } else {
                toast.error("Failed to rank candidates.");
            }
        } catch (err) {
            toast.error("An error occurred during ranking.");
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