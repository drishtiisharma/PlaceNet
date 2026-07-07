import {
    LayoutDashboard,
    Users,
    FileText,
    Bot,
    ChartColumn,
    UserRoundSearch,
} from "lucide-react";

export const dashboardMenu = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Candidates",
        href: "/dashboard/candidates",
        icon: Users,
    },
    {
        title: "Upload Resumes",
        href: "/dashboard/resume-upload",
        icon: FileText,
    },
    {
        title: "Resume Library",
        href: "/dashboard/resume-library",
        icon: FileText,
    },
    {
        title: "AI Chat",
        href: "/dashboard/ai-chat",
        icon: Bot,
    },
    {
        title: "Hiring Profile",
        href: "/dashboard/hiring-profile",
        icon: UserRoundSearch,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: ChartColumn,
    },
];

export const landingNav = [
    {
        title: "Features",
        href: "#features",
    },
    {
        title: "AI Search",
        href: "#ai-search",
    },
    {
        title: "Analytics",
        href: "#analytics",
    },
    {
        title: "Resources",
        href: "#faq",
    },
];