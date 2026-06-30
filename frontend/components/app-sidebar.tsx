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

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
                    url: "#",
                },
            ],
        },
        {
            title: "AI Chat",
            url: "#",
            icon: Bot,
        },
        {
            title: "Hiring Profile",
            url: "#",
            icon: UserRoundSearch,
        },
        {
            title: "Reports",
            url: "#",
            icon: ChartColumn,
            items: [
                {
                    title: "Analytics",
                    url: "#",
                },
                {
                    title: "Export Reports",
                    url: "#",
                },
            ],
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
