"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ReportPreview({ hiringProfiles }: { hiringProfiles: { id: string, title: string }[] }) {
    const [selectedProfile, setSelectedProfile] = useState<string>("");
    
    const handleExport = () => {
        if (!selectedProfile) return;
        window.location.href = `http://127.0.0.1:8000/analytics/export/${selectedProfile}`;
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Report Export</CardTitle>
                <CardDescription className="mb-2 mt-2">
                    Export a detailed Excel report containing candidate rankings and AI summaries for a specific hiring profile.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
                    <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select a Hiring Profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {hiringProfiles && hiringProfiles.map(hp => (
                                <SelectItem key={hp.id} value={hp.id}>
                                    {hp.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Button 
                        onClick={handleExport}
                        disabled={!selectedProfile}
                        className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Export as XLSX
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
