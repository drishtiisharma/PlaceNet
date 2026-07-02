"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CandidateSearch() {
    return (
        <div className="flex w-full max-w-xl items-center gap-2">
            <Input
                type="text"
                placeholder="Search by candidate name..."
                className="flex-1"
            />

            <Button className="bg-orange-600 hover:bg-blue-600 text-white">
                <Search className="mr-2 h-4 w-4" />
                Search
            </Button>
        </div>
    );
}