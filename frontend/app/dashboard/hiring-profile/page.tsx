import { HiringProfileTabs } from "@/components/hiring-profile/hiring-profile-tabs";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
export default function HiringProfilePage() {
    return (
        <div className="flex flex-col gap-6 p-6">

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Hiring Profile
                </h1>

                <p className="text-muted-foreground mt-2">
                    Create and manage job descriptions manually or let AI generate
                    them from a Job Description and supporting documents.
                </p>
            </div>

            <Card className="w-full">
                <CardContent>
                    <HiringProfileTabs />
                </CardContent>
            </Card>


        </div>
    );
}