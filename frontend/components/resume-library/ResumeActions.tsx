"use client";

import {
    Download,
    Eye,
    MoreHorizontal,
    RefreshCcw,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
                    onClick={() =>
                        window.open(
                            `${BACKEND_URL}/resume/view/${resumeId}`,
                            "_blank"
                        )
                    }
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        window.open(
                            `${BACKEND_URL}/resume/download/${resumeId}`
                        )
                    }
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
                        await fetch(
                            `${BACKEND_URL}/resume/${resumeId}`,
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