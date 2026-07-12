import Link from "next/link";
import Image from "next/image";

import { Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer
            id="footer"
            className="border-t bg-white"
        >
            <div className="mx-auto max-w-7xl px-6 py-16">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}

                    <div>

                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <Image
                                src="/logo.png"
                                alt="PlaceNet AI"
                                width={170}
                                height={42}
                                style={{ width: "auto", height: "auto" }}
                            />
                        </Link>

                        <p className="mt-5 leading-7 text-muted-foreground">
                            AI-powered placement and recruitment platform
                            that helps Training & Placement Offices and
                            recruiters discover the best candidates
                            effortlessly.
                        </p>

                    </div>

                    {/* Product */}

                    <div>

                        <h3 className="mb-5 font-semibold">
                            Product
                        </h3>

                        <div className="space-y-3">

                            <Link
                                href="#features"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                Features
                            </Link>

                            <Link
                                href="#ai-search"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                AI Search
                            </Link>

                            <Link
                                href="/dashboard"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                Dashboard
                            </Link>

                        </div>

                    </div>

                    {/* Resources */}

                    <div>

                        <h3 className="mb-5 font-semibold">
                            Resources
                        </h3>

                        <div className="space-y-3">

                            <Link
                                href="#faq"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                FAQ
                            </Link>

                            <Link
                                href="#workflow"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                Workflow
                            </Link>

                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                Documentation
                            </Link>

                        </div>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="mb-5 font-semibold">
                            Contact
                        </h3>

                        <div className="space-y-4">

                            <div className="flex items-center gap-3 text-muted-foreground">

                                <Mail className="h-4 w-4 text-orange-500" />

                                placenet.ai@gmail.com

                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground">

                                <MapPin className="h-4 w-4 text-orange-500" />

                                India

                            </div>

                        </div>

                        <div className="mt-6 space-y-2">

                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                GitHub Repository
                            </Link>

                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-orange-500"
                            >
                                LinkedIn
                            </Link>

                        </div>

                    </div>

                </div>

                <Separator className="my-10" />

                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">

                    <p suppressHydrationWarning>
                        © {new Date().getFullYear()} PlaceNet AI. All rights reserved.
                    </p>

                    <div className="flex gap-6">

                        <Link
                            href="#"
                            className="hover:text-orange-500"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="#"
                            className="hover:text-orange-500"
                        >
                            Terms of Service
                        </Link>

                    </div>

                </div>

            </div>
        </footer>
    );
}