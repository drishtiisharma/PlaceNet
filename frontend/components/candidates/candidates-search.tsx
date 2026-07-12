"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCandidates } from "./candidates-context";

export function CandidateSearch() {
    const { searchQuery, setSearchQuery } = useCandidates();

    return (
        <div className="flex w-full max-w-xl items-center gap-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search candidates by name, skills, or experience..."
                className="flex-1 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}