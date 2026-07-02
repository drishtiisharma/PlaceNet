import {
    ArrowRight,
    Bot,
    Send,
    Sparkles,
    User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const candidates = [
    {
        name: "Ananya Verma",
        degree: "B.Tech CSE",
        cgpa: "8.74",
        skills: ["React", "Node.js", "MongoDB"],
        match: "95%",
    },
    {
        name: "Rohit Singh",
        degree: "B.Tech CSE",
        cgpa: "8.32",
        skills: ["React", "Flask", "PostgreSQL"],
        match: "93%",
    },
    {
        name: "Neha Sharma",
        degree: "B.Tech CSE",
        cgpa: "8.18",
        skills: ["JavaScript", "Tailwind", "Next.js"],
        match: "90%",
    },
];

export default function HeroDemo() {
    return (
        <Card className="w-full max-w-md overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

            <CardHeader className="border-b border-orange-100 bg-orange-50/60 pb-4">
                <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        Ask PlaceNet AI
                    </span>
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                        AI Ranked
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-4">

                {/* chat thread */}
                <div className="space-y-4">

                    {/* user message */}
                    <div className="flex items-end justify-end gap-2">
                        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-orange-500 px-4 py-2.5 text-sm leading-6 text-white">
                            Find Computer Science students who know React,
                            Node.js and have internship experience with
                            CGPA above 8.
                        </div>
                        <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* AI response */}
                    <div className="flex items-end gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="bg-orange-500 text-white">
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-orange-50 px-4 py-2.5 text-sm leading-6 text-foreground">
                            Here are the top candidates matching your requirements.
                        </div>
                    </div>

                </div>

                {/* candidate results, presented as part of the AI's answer */}
                <div className="ml-9 space-y-2 rounded-2xl border border-orange-100 bg-white p-3">

                    {candidates.map((candidate) => (
                        <div
                            key={candidate.name}
                            className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-orange-50/70"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarFallback className="bg-orange-100 text-orange-600">
                                        {candidate.name
                                            .split(" ")
                                            .map((word) => word[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {candidate.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {candidate.degree} • CGPA {candidate.cgpa}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {candidate.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="bg-orange-50 text-[11px] font-normal text-orange-700"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <div className="text-sm font-bold text-orange-600">
                                    {candidate.match}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Match
                                </p>
                            </div>
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

                {/* chat input bar */}
                <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/60 px-3 py-2">
                    <input
                        type="text"
                        placeholder="Ask about candidates..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                        type="button"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-600"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>

            </CardContent>

        </Card>
    );
}