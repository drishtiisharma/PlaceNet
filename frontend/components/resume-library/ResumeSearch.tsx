"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResumeSearch() {
    return (
        <div className="flex items-center justify-between gap-4">

            <div className="flex flex-1">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search resumes..."
                        className="pl-10"
                    />
                </div>
            </div>


            <Button className="h-8 mb-2 bg-orange-600 hover:bg-blue-600 text-white">
                Search Resumes
            </Button>
        </div>
    );
}