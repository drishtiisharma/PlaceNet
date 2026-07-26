"use client";

import {
    Download,
    Eye,
    MoreHorizontal,
    RefreshCcw,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ResumeActionsProps = {
    resumeId: string;
};

const BACKEND_URL = "http://localhost:8000";

export function ResumeActions({
    resumeId,
}: ResumeActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            const res = await fetchApi(`/resume/view/${resumeId}`);
                            if (!res.ok) throw new Error("Failed to view");
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            const res = await fetchApi(`/resume/download/${resumeId}`);
                            if (!res.ok) throw new Error("Failed to download");
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `resume-${resumeId}.pdf`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Re-index
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={async () => {
                        await fetchApi(
                            `/resume/${resumeId}`,
                            {
                                method: "DELETE",
                            }
                        );

                        window.location.reload();
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
