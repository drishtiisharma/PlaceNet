"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function CandidateFilters() {
    return (
        <>

            <Select>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="CGPA" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="9">9+</SelectItem>
                    <SelectItem value="8">8+</SelectItem>
                    <SelectItem value="7">7+</SelectItem>
                    <SelectItem value="6">6+</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cse">CSE</SelectItem>
                    <SelectItem value="cse-ai">CSE (AI & ML)</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="ece">ECE</SelectItem>
                    <SelectItem value="eee">EEE</SelectItem>
                    <SelectItem value="me">Mechanical</SelectItem>
                </SelectContent>
            </Select>

        </>
    );
}