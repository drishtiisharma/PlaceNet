"use client";

import React, { createContext, useContext, useState } from "react";

export type RankingResult = {
    resume_id: string;
    full_name: string;
    match_score: number;
    ranking_position: number;
    matched_skills: string[];
    missing_skills: string[];
    preferred_skills_present: string[];
    missing_requirements: string[];
    additional_relevant_skills: string[];
    ai_summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string;
    why_this_score: string;
    skills: string[];
    education: string[];
    projects: string[];
    experience: string[];
    certifications: string[];
    department: string | null;
    cgpa: string | null;
};

interface Filters {
    skill: string;
    cgpa: string;
    year: string;
    branch: string;
}

interface CandidatesContextType {
    rankedCandidates: RankingResult[];
    setRankedCandidates: (candidates: RankingResult[]) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    hiringProfiles: any[];
    setHiringProfiles: (profiles: any[]) => void;
    selectedProfile: string;
    setSelectedProfile: (id: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    page: number;
    setPage: (page: number) => void;
    total: number;
    setTotal: (total: number) => void;
    fetchCandidates: (page?: number) => Promise<boolean>;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export function CandidatesProvider({ children }: { children: React.ReactNode }) {
    const [rankedCandidates, setRankedCandidates] = useState<RankingResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hiringProfiles, setHiringProfiles] = useState<any[]>([]);
    const [selectedProfile, setSelectedProfile] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>({
        skill: "",
        cgpa: "",
        year: "",
        branch: ""
    });

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch hiring profiles on mount
    React.useEffect(() => {
        fetch("http://127.0.0.1:8000/hiring-profile/")
            .then(res => res.json())
            .then(data => setHiringProfiles(data))
            .catch(err => console.error(err));
    }, []);

    const fetchCandidates = async (pageToFetch = page) => {
        if (!selectedProfile) return;
        setIsLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/ranking/${selectedProfile}/results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: pageToFetch, limit: 20 })
            });

            if (res.ok) {
                const data = await res.json();
                setRankedCandidates(data.items);
                setTotal(data.total);
                setPage(pageToFetch);
                return true;
            } else {
                console.error("Failed to fetch candidates");
                return false;
            }
        } catch (err) {
            console.error("Error fetching candidates:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CandidatesContext.Provider value={{ 
            rankedCandidates, setRankedCandidates, 
            isLoading, setIsLoading,
            hiringProfiles, setHiringProfiles,
            selectedProfile, setSelectedProfile,
            searchQuery, setSearchQuery,
            filters, setFilters,
            page, setPage,
            total, setTotal,
            fetchCandidates
        }}>
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
