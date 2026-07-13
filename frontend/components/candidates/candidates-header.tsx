"use client";

import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCandidates } from "./candidates-context";

export function CandidatesHeader() {
    const { hiringProfiles, selectedProfile, setSelectedProfile, setFilters } = useCandidates();

    const handleProfileChange = (profileId: string) => {
        setSelectedProfile(profileId);
        // Reset filters when profile changes
        setFilters({ skill: "all", cgpa: "all", year: "all", branch: "all" });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        List of Candidates
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select a Hiring Profile to search, filter, and rank candidates using AI.
                    </p>
                </div>
                
                <div className="flex items-center">
                    <Select value={selectedProfile} onValueChange={handleProfileChange}>
                        <SelectTrigger className="w-[280px] sm:w-[340px] max-w-full h-11 border-orange-200 bg-orange-50 font-medium">
                            <Sparkles className="mr-2 h-4 w-4 text-orange-600 shrink-0" />
                            <div className="truncate text-left w-[calc(100%-2rem)]">
                                <SelectValue placeholder="Select Hiring Profile" />
                            </div>
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                            {hiringProfiles.map(p => (
                                <SelectItem key={p.id} value={p.id} className="truncate">
                                    {p.job_title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />
        </div>
    );
}
