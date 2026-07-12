"use client";

import dynamic from "next/dynamic";
import { ResumeViewerProvider } from "./resume-viewer-context";

const ResumeViewerModal = dynamic(
  () => import("./resume-viewer-modal").then(mod => mod.ResumeViewerModal),
  { ssr: false }
);

export function ResumeViewerWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ResumeViewerProvider>
            {children}
            <ResumeViewerModal />
        </ResumeViewerProvider>
    );
}
