"use client";

import { MoreHorizontal, Eye, Download, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateSheet } from "./candidate-sheet";

type Candidate = {
    id: number;
    name: string;
    phone: string;
    resume: string;
    score: number | null;
};

interface CandidateActionsProps {
    candidate: Candidate;
}

export function CandidateActions({
    candidate,
}: CandidateActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Resume
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                </DropdownMenuItem>

                <CandidateSheet>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                    >
                        <UserRound className="mr-2 h-4 w-4" />
                        View Candidate
                    </DropdownMenuItem>
                </CandidateSheet>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}