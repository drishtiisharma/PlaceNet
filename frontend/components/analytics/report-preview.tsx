"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

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
    
    const handleExport = async () => {
        if (!selectedProfile) return;
        
        const toastId = toast.loading("Generating export...");
        try {
            const res = await fetchApi(`/analytics/export/${selectedProfile}`);
            
            if (res.status === 401 || res.status === 403) {
                toast.error("Session expired. Please log in again.", { id: toastId });
                return;
            }
            if (!res.ok) {
                throw new Error("Failed to export report");
            }
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `hiring_profile_${selectedProfile}_report.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            toast.success("Export downloaded successfully!", { id: toastId });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to download export.", { id: toastId });
        }
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
