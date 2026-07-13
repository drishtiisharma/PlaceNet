"use client";

import { useState } from "react";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Loader2, Send, Clock } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import ScrollReveal from "@/components/animations/scroll-reveal";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        toast.success("Your message has been sent successfully! We'll get back to you soon.");

        setFormData({
            name: "",
            email: "",
            organization: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <ScrollReveal delay={0.1}>
                    <section className="relative overflow-hidden py-24 text-center">
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-orange-200/40 blur-[130px]" />
                        {/* Faint dot grid for texture */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.35]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, rgba(234,88,12,0.15) 1px, transparent 1px)",
                                backgroundSize: "28px 28px",
                                maskImage:
                                    "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
                            }}
                        />

                        <div className="relative z-10 mx-auto max-w-2xl px-6">
                            <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
                                Let's start a <span className="text-orange-500">conversation</span>
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                Questions about PlaceNet AI, ideas for a partnership, or something not
                                working quite right? Tell us about it below.
                            </p>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Main Content Grid */}
                <ScrollReveal delay={0.2}>
                    <section className="mx-auto max-w-7xl px-6 pb-28">
                        <div className="grid gap-8 lg:grid-cols-5 lg:gap-8">
                            {/* Left Column: Information */}
                            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-500 to-orange-600 p-8 shadow-xl shadow-orange-900/10 lg:col-span-2">
                                {/* Decorative pin motif, echoing the logo */}
                                <MapPin
                                    strokeWidth={1}
                                    className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 text-white/10"
                                />

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-white">We're here to help</h2>
                                    <p className="mt-3 text-sm leading-relaxed text-orange-50/90">
                                        Whether you're scheduling a walkthrough, asking about institution
                                        pricing, exploring a partnership, or need technical support &mdash; our
                                        team reads every message.
                                    </p>

                                    <div className="mt-10 space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/20">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    placenet.ai@gmail.com
                                                </p>
                                                <p className="text-xs text-orange-50/80">Direct line to the team</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/20">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">India</p>
                                                <p className="text-xs text-orange-50/80">Global remote support</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/20">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    Within 24 hours
                                                </p>
                                                <p className="text-xs text-orange-50/80">Typical response time</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-12 border-t border-white/20 pt-8">
                                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange-50/80">
                                        Connect with us
                                    </h3>
                                    <div className="flex gap-3">
                                        <Link
                                            href="https://github.com/drishtiisharma/PlaceNet"
                                            target="_blank"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/20 transition-all hover:bg-white hover:text-orange-600"
                                        >
                                            <FaGithub className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/20 transition-all hover:bg-white hover:text-orange-600"
                                        >
                                            <FaLinkedin className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <Card className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-900/5 lg:col-span-3">
                                <h2 className="text-2xl font-bold">Send a message</h2>
                                <p className="mt-2 mb-8 text-sm text-muted-foreground">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Full Name <span className="text-orange-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                className="focus-visible:ring-orange-400"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email Address <span className="text-orange-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                className="focus-visible:ring-orange-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organization">
                                            Organization / University (Optional)
                                        </Label>
                                        <Input
                                            id="organization"
                                            placeholder="e.g. Stanford University"
                                            value={formData.organization}
                                            onChange={(e) =>
                                                setFormData({ ...formData, organization: e.target.value })
                                            }
                                            className="focus-visible:ring-orange-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">
                                            Subject <span className="text-orange-500">*</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({ ...formData, subject: e.target.value })
                                            }
                                            className="focus-visible:ring-orange-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">
                                            Message <span className="text-orange-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Write your message here..."
                                            className="min-h-[150px] resize-y focus-visible:ring-orange-400"
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-11 w-full bg-orange-500 hover:bg-orange-600"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </section>
                </ScrollReveal>
            </main>

            <Footer />
        </div>
    );
}