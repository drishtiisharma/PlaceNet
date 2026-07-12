"use client";

import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    FileText,
    Bot,
    ChartColumn,
    UserRoundSearch,
} from "lucide-react";

import {
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { dashboardMenu } from "@/components/common/navigation";

export default function LandingSheet() {
    return (
        <SheetContent side="left" className="w-72 p-0">

            <SheetHeader className="border-b p-5">

                <Image
                    src="/logo.png"
                    alt="PlaceNet AI"
                    width={190}
                    height={50}
                    style={{ width: "auto", height: "auto" }}
                    priority
                />

                <SheetTitle className="sr-only">
                    Navigation
                </SheetTitle>

            </SheetHeader>

            <nav className="flex flex-col p-3">

                {dashboardMenu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600"
                        >
                            <Icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    );
                })}

            </nav>

        </SheetContent>
    );
}