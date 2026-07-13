"use client";

import { FileSpreadsheet } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function ReportPreview() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription className="mb-2 mt-2">
                    Export an Excel report containing analytics and student information.
                    <p className="mt-2 mb-2">The exported report will include:</p>
                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        <li>Department Distribution</li>
                        <li>Top Skills</li>
                        <li>Student Information</li>
                    </ul>
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="mt-2 flex justify-end">
                    <Button className="bg-orange-600 hover:bg-blue-600 text-white">
                        Export as XLSX
                    </Button>
                </div>

            </CardContent>


        </Card>
    );





}
