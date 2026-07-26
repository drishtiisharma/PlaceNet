"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
    LayoutDashboard,
    Users,
    FileText,
    Bot,
    ChartColumn,
    UserRoundSearch,
    UserCircle,
    LogOut,
} from "lucide-react";

import {
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { dashboardMenu } from "@/components/common/navigation";

export default function LandingSheet() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            toast.error(error.message || "Failed to log out");
        } else {
            toast.success("Logged out successfully");
            router.push("/auth");
        }
    };

    return (
        <SheetContent side="left" className="w-72 p-0 flex flex-col h-full">

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

            <nav className="flex flex-col p-3 flex-1 overflow-y-auto">

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

            <div className="p-3 border-t mt-auto flex flex-col gap-1">
                <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600"
                >
                    <UserCircle className="h-5 w-5" />
                    My Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>

        </SheetContent>
    );
}
