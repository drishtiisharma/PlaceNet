import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Search,
    TrendingUp,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const checklist = [
    "Natural language search",
    "Semantic understanding",
    "Context-aware candidate ranking",
    "Instant shortlist generation",
];

const stats = [
    { icon: Users, value: "18", label: "Matches" },
    { icon: TrendingUp, value: "95%", label: "Top Score" },
    { icon: Clock, value: "0.8s", label: "Search Time" },
];

const ranked = [
    { rank: 1, name: "Ananya Verma", degree: "B.Tech CSE • CGPA 8.74", match: 95 },
    { rank: 2, name: "Rohit Singh", degree: "B.Tech CSE • CGPA 8.32", match: 93 },
    { rank: 3, name: "Neha Sharma", degree: "B.Tech CSE • CGPA 8.18", match: 90 },
];

export default function AiShowcase() {
    return (
        <section id="ai-search" className="bg-white py-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">

                {/* left copy */}
                <div>
                    <Badge className="bg-orange-50 font-medium text-orange-600 hover:bg-orange-50">
                        AI Recruitment Assistant
                    </Badge>

                    <h2 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
                        Search resumes
                        <br />
                        <span className="text-orange-500">the way you think.</span>
                    </h2>

                    <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                        Forget complex filters. Just describe the candidate you're
                        looking for and PlaceNet understands your intent using
                        Retrieval-Augmented Generation (RAG), semantic search, and
                        intelligent ranking.
                    </p>

                    <ul className="mt-8 space-y-3">
                        {checklist.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <Button className="mt-9 bg-orange-500 hover:bg-orange-600">
                        Try AI Search
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* right demo: live search dashboard */}
                <Card className="w-full max-w-lg overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

                    <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/50 px-5 py-3">
                        <span className="text-xs font-medium text-muted-foreground">
                            PlaceNet AI Search
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                            Live
                        </div>
                    </div>

                    <div className="space-y-5 p-5">

                        {/* search field */}
                        <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                            <Search className="h-4 w-4 shrink-0 text-orange-500" />
                            <p className="text-sm text-foreground">
                                React, Flask &amp; SQL devs, internship exp, CGPA 8+
                                <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-orange-400 align-middle" />
                            </p>
                        </div>

                        {/* stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div
                                    key={label}
                                    className="rounded-xl border border-orange-100 bg-white p-3 text-center"
                                >
                                    <Icon className="mx-auto h-4 w-4 text-orange-500" />
                                    <p className="mt-1.5 text-lg font-bold leading-none">{value}</p>
                                    <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* ranked candidates */}
                        <div className="space-y-3">
                            {ranked.map((candidate) => (
                                <div key={candidate.name} className="flex items-center gap-3">
                                    <div
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${candidate.rank === 1
                                                ? "bg-orange-500 text-white"
                                                : "bg-orange-50 text-orange-600"
                                            }`}
                                    >
                                        {candidate.rank}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-medium">{candidate.name}</p>
                                            <span className="shrink-0 text-xs font-semibold text-orange-600">
                                                {candidate.match}%
                                            </span>
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {candidate.degree}
                                        </p>
                                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-orange-50">
                                            <div
                                                className="h-full rounded-full bg-orange-500"
                                                style={{ width: `${candidate.match}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            View Full Shortlist
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                    </div>
                </Card>

            </div>
        </section>
    );
}