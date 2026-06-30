import { ResumeSkeleton } from "./ResumeSkeleton";

export function ResumeTable() {
    // Replace this later with your API loading state
    const isLoading = true;

    if (isLoading) {
        return <ResumeSkeleton />;
    }

    return null;
}