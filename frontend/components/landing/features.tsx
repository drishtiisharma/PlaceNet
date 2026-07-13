import {
    ArrowRight,
    Briefcase,
    Sparkles,
    Star,
    User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const topMatch = {
    name: "Ananya Verma",
    degree: "B.Tech CSE",
    cgpa: "8.74",
    skills: ["React", "Flask", "SQL", "Internship"],
    match: "95%",
};

const otherMatches = [
    { name: "Rohit Singh", match: "93%" },
    { name: "Neha Sharma", match: "90%" },
];

export default function HeroDemo() {
    return (
        <Card className="w-full max-w-md space-y-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-xl">

            {/* recruiter query */}
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-semibold leading-tight">Recruiter</p>
                    <p className="text-xs text-muted-foreground">Search Request</p>
                </div>
            </div>

            <div className="rounded-2xl bg-muted/50 p-4 text-sm leading-6 text-foreground">
                Find Computer Science students who know React, Flask and SQL
                with internship experience and CGPA above 8.
            </div>

            {/* AI response */}
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Briefcase className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold">PlaceNet AI</span>
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        I found{" "}
                        <span className="font-semibold text-foreground">
                            18 matching candidates
                        </span>
                        . The highest ranked profile is based on skills,
                        internship experience, academic performance, and
                        project relevance.
                    </p>

                    {/* top match, highlighted */}
                    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2">
                                <Star className="mt-0.5 h-4 w-4 shrink-0 fill-orange-400 text-orange-400" />
                                <div>
                                    <p className="text-sm font-semibold leading-tight">
                                        {topMatch.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {topMatch.degree} • CGPA {topMatch.cgpa}
                                    </p>
                                </div>
                            </div>
                            <Badge className="shrink-0 rounded-full bg-green-500 text-white hover:bg-green-500">
                                {topMatch.match} Match
                            </Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {topMatch.skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="border border-orange-200 bg-white font-normal text-orange-700"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* remaining matches, compact */}
                    <div className="space-y-1.5">
                        {otherMatches.map((candidate) => (
                            <div
                                key={candidate.name}
                                className="flex items-center justify-between rounded-xl px-1 py-1.5 text-sm"
                            >
                                <span className="text-foreground">{candidate.name}</span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    {candidate.match} match
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <Button variant="outline" className="flex-1 border-orange-200 hover:bg-orange-50">
                            View All
                        </Button>
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                            Export Shortlist
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                </div>
            </div>

        </Card>
    );
}
