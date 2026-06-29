"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    Bot,
    ChartColumn,
    BriefcaseBusiness,
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
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "#",
                },
            ],
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
                    url: "#",
                },
                {
                    title: "Resume Library",
                    url: "#",
                },
            ],
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
        {
            title: "AI Chat",
            url: "#",
            icon: Bot,
        },

    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>

            <SidebarContent>
                <NavMain items={data.navMain} />

            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
