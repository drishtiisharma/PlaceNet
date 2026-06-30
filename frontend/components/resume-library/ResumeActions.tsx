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

export function ResumeActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Re-index
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}