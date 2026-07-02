import { ArrowRight, Bot, Database, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import HeroDemo from "@/components/landing/hero-demo";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-orange-50/30">

            {/* Background Blur */}

            <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-100 blur-[120px] opacity-40" />

            <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">

                {/* LEFT */}

                <div>

                    <Badge
                        variant="secondary"
                        className="mb-6 rounded-full bg-orange-100 px-4 py-1 text-orange-600"
                    >
                        AI-Powered Placement & Recruitment
                    </Badge>

                    <h1 className="max-w-xl text-5xl font-bold tracking-tight lg:text-6xl">

                        Find the right candidate.

                        <span className="mt-2 block text-orange-500">
                            Faster. Smarter. Effortlessly.
                        </span>

                    </h1>

                    <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">

                        PlaceNet AI helps Training & Placement Offices and recruiters
                        automatically parse resumes, perform semantic search, rank
                        candidates intelligently, and discover the best talent in seconds.

                    </p>

                    {/* Buttons */}

                    <div className="mt-10 flex flex-wrap gap-4">

                        <Button
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Get Started

                            <ArrowRight className="ml-2 h-4 w-4" />

                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                        >
                            Watch Demo
                        </Button>

                    </div>

                    {/* Feature Chips */}

                    <div className="mt-10 flex flex-wrap gap-3">

                        <Badge
                            variant="outline"
                            className="rounded-full px-4 py-2"
                        >
                            <FileText className="mr-2 h-4 w-4 text-orange-500" />
                            Resume Parsing
                        </Badge>

                        <Badge
                            variant="outline"
                            className="rounded-full px-4 py-2"
                        >
                            <Search className="mr-2 h-4 w-4 text-orange-500" />
                            Semantic Search
                        </Badge>

                        <Badge
                            variant="outline"
                            className="rounded-full px-4 py-2"
                        >
                            <Bot className="mr-2 h-4 w-4 text-orange-500" />
                            AI Assistant
                        </Badge>

                        <Badge
                            variant="outline"
                            className="rounded-full px-4 py-2"
                        >
                            <Database className="mr-2 h-4 w-4 text-orange-500" />
                            RAG Search
                        </Badge>

                    </div>

                </div>

                {/* RIGHT */}

                <HeroDemo />

            </div>

        </section>
    );
}