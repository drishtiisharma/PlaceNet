"use client";

import { useState } from "react";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
        <div className="flex min-h-screen flex-col">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero Section */}
                <ScrollReveal delay={0.1}>
                    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-orange-50/30 py-24 text-center">
                        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-100 blur-[120px] opacity-40" />
                        <div className="relative z-10 mx-auto max-w-2xl px-6">
                            <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
                                Get in <span className="text-orange-500">Touch</span>
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                Have questions about PlaceNet AI? Looking for partnerships or need technical support? We'd love to hear from you.
                            </p>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Main Content Grid */}
                <ScrollReveal delay={0.2}>
                <section className="mx-auto max-w-7xl px-6 pb-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        
                        {/* Left Column: Information */}
                        <div className="flex flex-col justify-between rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 p-8 shadow-xl shadow-orange-900/5 h-full">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">We're here to help</h2>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    Whether you're looking to schedule a product demo, inquire about institution pricing, explore enterprise partnerships, or request technical support—our team is ready to assist you.
                                </p>
                                
                                <div className="mt-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-orange-100 text-orange-600 shadow-sm">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">placenet.ai@gmail.com</p>
                                            <p className="text-xs text-muted-foreground">Typical response within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-orange-100 text-orange-600 shadow-sm">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">India</p>
                                            <p className="text-xs text-muted-foreground">Global Remote Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-orange-100/60">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connect with us</h3>
                                <div className="flex gap-3">
                                    <Link 
                                        href="https://github.com/drishtiisharma/PlaceNet" 
                                        target="_blank"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-orange-100 text-muted-foreground transition-all hover:border-orange-300 hover:text-orange-600 hover:shadow-sm"
                                    >
                                        <FaGithub className="h-4 w-4" />
                                    </Link>
                                    <Link 
                                        href="#" 
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-orange-100 text-muted-foreground transition-all hover:border-orange-300 hover:text-orange-600 hover:shadow-sm"
                                    >
                                        <FaLinkedin className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <Card className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-900/5">
                            <h2 className="text-2xl font-bold">Send a Message</h2>
                            <p className="mt-2 text-sm text-muted-foreground mb-8">
                                Fill out the form below and we will get back to you as soon as possible.
                            </p>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="name" 
                                            placeholder="John Doe" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="john@example.com" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization / University (Optional)</Label>
                                    <Input 
                                        id="organization" 
                                        placeholder="e.g. Stanford University" 
                                        value={formData.organization}
                                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="subject" 
                                        placeholder="How can we help?" 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                                    <Textarea 
                                        id="message" 
                                        placeholder="Write your message here..." 
                                        className="min-h-[150px] resize-y"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-orange-500 hover:bg-orange-600 h-11"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Message...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </section>
                </ScrollReveal>
                
                {/* CTA Section */}
                <ScrollReveal delay={0.3}>
                <section className="bg-orange-500 py-16 text-center">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 className="text-3xl font-bold text-white">Ready to streamline your recruitment?</h2>
                        <p className="mt-4 text-orange-100">
                            Experience the power of AI-driven semantic search and candidate ranking today.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50" asChild>
                                <Link href="/dashboard">
                                    Try AI Search
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-orange-300 text-white hover:bg-orange-600 hover:text-white" asChild>
                                <Link href="/dashboard">
                                    Schedule a Demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
                </ScrollReveal>
            </main>

            <Footer />
        </div>
    );
}
