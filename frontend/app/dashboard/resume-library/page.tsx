import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeSearch } from "../../../components/resume-library/ResumeSearch";
import { ResumeTable } from "../../../components/resume-library/ResumeTable";

export default function ResumeLibraryPage() {
    return (
        <div className="p-6">
            <h1 className="mb-10 text-3xl font-bold">
                Resume Library
            </h1>
            <Card>
                <CardHeader>

                    <p className="text-sm text-muted-foreground">
                        View and manage all uploaded resumes.
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <ResumeSearch />
                    <ResumeTable />
                </CardContent>
            </Card>
        </div>
    );
}