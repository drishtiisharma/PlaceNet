"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ResumeViewerContextType {
    isOpen: boolean;
    resumeId: string | null;
    openResume: (id: string) => void;
    closeResume: () => void;
}

const ResumeViewerContext = createContext<ResumeViewerContextType | undefined>(undefined);

export function ResumeViewerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [resumeId, setResumeId] = useState<string | null>(null);

    const openResume = (id: string) => {
        setResumeId(id);
        setIsOpen(true);
    };

    const closeResume = () => {
        setIsOpen(false);
        setResumeId(null);
    };

    return (
        <ResumeViewerContext.Provider value={{ isOpen, resumeId, openResume, closeResume }}>
            {children}
        </ResumeViewerContext.Provider>
    );
}

export function useResumeViewer() {
    const context = useContext(ResumeViewerContext);
    if (!context) {
        throw new Error("useResumeViewer must be used within a ResumeViewerProvider");
    }
    return context;
}
