"use client"
import Image from "next/image"
import * as React from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    Bot,
    ChartColumn,
    UserRoundSearch,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
// This is sample data.
const data = {
    user: {
        name: "PlaceNet",
        email: "tpo@college.edu",
        avatar: "/avatars/placenet.jpg",
    },

    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
        },

        {
            title: "Candidates",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "All Candidates",
                    url: "#",
                },
                {
                    title: "Shortlisted",
                    url: "#",
                },
                {
                    title: "Rejected",
                    url: "#",
                },
            ],
        },

        {
            title: "Resumes",
            url: "#",
            icon: FileText,
            items: [
                {
                    title: "Upload Resumes",
                    url: "/dashboard/resume-upload",
                },
                {
                    title: "Resume Library",
                    url: "/dashboard/resume-library",
                },
            ],
        },
        {
            title: "AI Chat",
            url: "/dashboard/ai-chat",
            icon: Bot
        },
        {
            title: "Hiring Profile",
            url: "/dashboard/hiring-profile",
            icon: UserRoundSearch,
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: ChartColumn,
        },

    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>

            <SidebarHeader className="p-3">
                <Image
                    src="/logo.png"
                    alt="PlaceNet AI"
                    width={500}
                    height={100}
                    priority
                />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    )
}
