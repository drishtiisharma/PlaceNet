"use client";

import React, { createContext, useContext, useState } from "react";

export type RankingResult = {
    resume_id: string;
    candidate_name: string;
    match_score: number;
    ranking_position: number;
    matched_skills: string[];
    missing_skills: string[];
    explanation: string;
};

interface CandidatesContextType {
    rankedCandidates: RankingResult[];
    setRankedCandidates: (candidates: RankingResult[]) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export function CandidatesProvider({ children }: { children: React.ReactNode }) {
    const [rankedCandidates, setRankedCandidates] = useState<RankingResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <CandidatesContext.Provider value={{ rankedCandidates, setRankedCandidates, isLoading, setIsLoading }}>
            {children}
        </CandidatesContext.Provider>
    );
}

export function useCandidates() {
    const context = useContext(CandidatesContext);
    if (!context) {
        throw new Error("useCandidates must be used within a CandidatesProvider");
    }
    return context;
}
