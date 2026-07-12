"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCandidates } from "./candidates-context";

export function RankCandidatesPopover() {
    const { setRankedCandidates, setIsLoading, isLoading } = useCandidates();
    const [hiringProfiles, setHiringProfiles] = useState<any[]>([]);
    const [selectedProfile, setSelectedProfile] = useState("");
    const [topK, setTopK] = useState(10);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetch("http://127.0.0.1:8000/hiring-profile/")
                .then(res => res.json())
                .then(data => setHiringProfiles(data))
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!selectedProfile) {
            alert("Please select a hiring profile first.");
            return;
        }

        setIsLoading(true);
        setIsOpen(false);
        try {
            const res = await fetch(`http://127.0.0.1:8000/ranking/${selectedProfile}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ top_k: Number(topK) })
            });

            if (res.ok) {
                const data = await res.json();
                setRankedCandidates(data);
            } else {
                alert("Failed to rank candidates.");
            }
        } catch (err) {
            console.error(err);
            alert("Error during ranking.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button className="bg-orange-600 hover:bg-blue-600 text-white" disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isLoading ? "Ranking..." : "Rank Candidates"}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80" align="end">
                <PopoverHeader>
                    <PopoverTitle>Rank Candidates</PopoverTitle>
                    <PopoverDescription>
                        Select a hiring profile and enter the number of top candidates to retrieve based on AI resume ranking.
                    </PopoverDescription>
                </PopoverHeader>

                <FieldGroup className="gap-4">
                    <Field>
                        <FieldLabel htmlFor="hiringProfile">Hiring Profile</FieldLabel>
                        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Profile" />
                            </SelectTrigger>
                            <SelectContent>
                                {hiringProfiles.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.job_title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="topCandidates">Top Candidates</FieldLabel>
                        <Input
                            id="topCandidates"
                            type="number"
                            placeholder="20"
                            min={1}
                            value={topK}
                            onChange={(e) => setTopK(Number(e.target.value))}
                        />
                    </Field>

                    <Button onClick={handleGenerate} className="w-full bg-orange-600 hover:bg-blue-600 text-white">
                        Generate Ranking
                    </Button>
                </FieldGroup>
            </PopoverContent>
        </Popover>
    );
}