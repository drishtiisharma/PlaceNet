import {
    Upload,
    FileText,
    Database,
    Search,
    Trophy,
    Download,
} from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "Upload Resumes",
        description: "Upload single or bulk resumes in PDF or DOCX format.",
    },
    {
        icon: FileText,
        title: "Resume Parsing",
        description: "Extract skills, education, experience and projects automatically.",
    },
    {
        icon: Database,
        title: "Knowledge Base",
        description: "Store structured candidate data in a searchable database.",
    },
    {
        icon: Search,
        title: "AI Search",
        description: "Search candidates naturally using job requirements.",
    },
    {
        icon: Trophy,
        title: "Smart Ranking",
        description: "Rank candidates based on semantic relevance and fit.",
    },
    {
        icon: Download,
        title: "Export Results",
        description: "Export shortlisted candidates in one click.",
    },
];

export default function Workflow() {
    return (
        <section id="how-it-works" className="bg-orange-50/40 py-20">
            <div className="mx-auto max-w-7xl px-6">

                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
                        How <span className="text-orange-500">PlaceNet</span> Works.
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        From uploading resumes to exporting shortlisted candidates,
                        PlaceNet automates the complete recruitment workflow.
                    </p>
                </div>

                <div className="relative mt-16">
                    {/* connecting line running through the icon row */}
                    <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent md:block" />

                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-6 md:gap-x-2">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div key={step.title} className="relative flex flex-col items-center text-center">

                                    {/* icon on the line, number as a badge on the icon */}
                                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-white shadow-sm ring-8 ring-orange-50/40">
                                        <Icon className="h-6 w-6 text-orange-500" strokeWidth={1.75} />
                                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold leading-tight text-foreground">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>

                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
