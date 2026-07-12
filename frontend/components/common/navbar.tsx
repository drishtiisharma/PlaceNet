"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import AppSheet from "./app-sheet";
import { landingNav } from "./navigation";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";



export default function LandingNavbar() {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        // Only run scroll spy on the homepage
        if (pathname !== "/") return;

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px", // Adjust margin for earlier triggering during scroll
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(`#${entry.target.id}`);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observe all sections mapped in landingNav
        landingNav.forEach((item) => {
            if (item.href.startsWith("#")) {
                const id = item.href.substring(1);
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-3">

                {/* Left */}
                <div className="flex items-center gap-3">

                    {/* Sidebar Button (currently visual only) */}
                    <Sheet>

                        <SheetTrigger asChild>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                        </SheetTrigger>

                        <AppSheet />

                    </Sheet>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                    >
                        <Image
                            src="/logo.png"
                            alt="PlaceNet AI"
                            width={210}
                            height={52}
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                    </Link>

                </div>

                {/* Center */}
                <NavigationMenu className="hidden lg:flex">

                    <NavigationMenuList>

                        {landingNav.map((item) => (
                            <NavigationMenuItem key={item.title}>

                                <NavigationMenuLink asChild>

                                    <Link
                                        href={item.href}
                                        className={`group inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:text-orange-600 ${
                                            activeSection === item.href ? "text-orange-600" : "text-foreground"
                                        }`}
                                    >
                                        {item.title}
                                    </Link>

                                </NavigationMenuLink>

                            </NavigationMenuItem>
                        ))}

                    </NavigationMenuList>

                </NavigationMenu>

                {/* Right */}
                <div className="hidden items-center gap-3 lg:flex">

                    <Button
                        variant="ghost"
                        asChild
                    >
                        <Link href="/dashboard">
                            Login
                        </Link>
                    </Button>

                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        asChild
                    >
                        <Link href="/dashboard">
                            Sign Up
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link href="/contact">
                            Contact Us
                        </Link>
                    </Button>

                </div>

                {/* Mobile Buttons */}

                <div className="flex items-center gap-2 lg:hidden">

                    <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        Sign Up
                    </Button>

                </div>

            </div>
        </header>
    );
}