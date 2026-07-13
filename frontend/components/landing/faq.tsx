"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does PlaceNet AI rank candidates?",
        answer:
            "PlaceNet combines semantic search, Retrieval-Augmented Generation (RAG), resume parsing, and recruiter requirements to identify and rank the most relevant candidates instead of relying only on keyword matching.",
    },
    {
        question: "What file formats are supported?",
        answer:
            "Currently, PlaceNet supports PDF resumes and extracts structured information such as education, skills, projects, certifications, internships, and work experience.",
    },
    {
        question: "Can recruiters search using natural language?",
        answer:
            "Yes. Recruiters can simply describe the type of candidate they need, such as 'Find CSE students with React, Flask, and internship experience,' and PlaceNet will understand the intent.",
    },
    {
        question: "How does resume parsing work?",
        answer:
            "Uploaded resumes are automatically parsed to extract structured candidate information, which is then stored in a searchable knowledge base for quick retrieval.",
    },
    {
        question: "Who is PlaceNet built for?",
        answer:
            "PlaceNet is designed for Training & Placement Offices (TPOs), placement coordinators, and recruiters who manage large volumes of student resumes.",
    },
];

export default function FAQ() {
    return (
        <section
            id="faq"
            className="bg-orange-50/40 py-28"
        >
            <div className="mx-auto max-w-4xl px-6">

                <div className="text-center">

                    <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                        Frequently Asked Questions
                    </p>

                    <h2 className="mt-3 text-4xl font-bold">
                        Everything you need to know
                    </h2>

                    <p className="mt-5 text-lg text-muted-foreground">
                        Have questions? Here are the most common ones about
                        PlaceNet AI and how it helps streamline placements.
                    </p>

                </div>

                <Accordion
                    type="single"
                    collapsible
                    className="mt-14 w-full"
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                        >
                            <AccordionTrigger className="text-left text-base font-semibold">
                                {faq.question}
                            </AccordionTrigger>

                            <AccordionContent className="leading-7 text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

            </div>
        </section>
    );
}
