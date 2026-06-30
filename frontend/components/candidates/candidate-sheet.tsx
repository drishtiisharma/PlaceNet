"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface CandidateSheetProps {
    children: React.ReactNode;
}

export function CandidateSheet({
    children,
}: CandidateSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent className="sm:max-w-lg overflow-y-auto">

                <SheetHeader>
                    <SheetTitle>Candidate Details</SheetTitle>
                    <SheetDescription>
                        AI-generated candidate profile and resume information.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">

                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            Basic Information
                        </h3>

                        <Separator />

                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>Name:</strong> —</p>
                            <p><strong>Phone:</strong> —</p>
                            <p><strong>Email:</strong> —</p>
                            <p><strong>Branch:</strong> —</p>
                            <p><strong>CGPA:</strong> —</p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            Skills
                        </h3>

                        <Separator />

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">React</Badge>
                            <Badge variant="secondary">Python</Badge>
                            <Badge variant="secondary">SQL</Badge>
                        </div>
                    </div>

                    {/* Resume Summary */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            Resume Summary
                        </h3>

                        <Separator />

                        <p className="text-sm text-muted-foreground">
                            AI-generated summary will appear here.
                        </p>
                    </div>

                    {/* AI Analysis */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            AI Analysis
                        </h3>

                        <Separator />

                        <p className="text-sm text-muted-foreground">
                            Candidate ranking explanation and strengths
                            will appear here after AI processing.
                        </p>
                    </div>

                    <Button className="w-full">
                        Download Resume
                    </Button>

                </div>

            </SheetContent>
        </Sheet>
    );
}