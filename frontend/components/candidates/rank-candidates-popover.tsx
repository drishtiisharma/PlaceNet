"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";

export function RankCandidatesPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-orange-600 hover:bg-blue-600 text-white">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Rank Candidates
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-80"
                align="end"
            >
                <PopoverHeader>
                    <PopoverTitle>
                        Rank Candidates
                    </PopoverTitle>

                    <PopoverDescription>
                        Enter the number of top candidates to
                        retrieve based on AI resume ranking.
                    </PopoverDescription>
                </PopoverHeader>

                <FieldGroup className="gap-4">

                    <Field>
                        <FieldLabel htmlFor="topCandidates">
                            Top Candidates
                        </FieldLabel>

                        <Input
                            id="topCandidates"
                            type="number"
                            placeholder="20"
                            min={1}
                        />
                    </Field>

                    <Button className="w-full bg-orange-600 hover:bg-blue-600 text-white">
                        Generate Ranking
                    </Button>

                </FieldGroup>
            </PopoverContent>
        </Popover>
    );
}