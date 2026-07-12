"use client";
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
                                        className="group inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:text-orange-600"
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
                        <Link href="#footer">
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