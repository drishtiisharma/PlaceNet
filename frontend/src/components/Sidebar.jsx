import { FileText, Search, BrainCircuit, Users, Download, BookOpen, MessageSquare } from "lucide-react"

const navItems = [
    { icon: FileText, label: "Resumes", active: true },
    { icon: Search, label: "Search", active: false },
    { icon: BrainCircuit, label: "JD Matcher", active: false },
    { icon: Users, label: "Shortlist", active: false },
    { icon: BookOpen, label: "Knowledge Base", active: false },
    { icon: MessageSquare, label: "AI Copilot", active: false },
    { icon: Download, label: "Export", active: false },
]

export default function Sidebar() {
    return (
        <aside className="h-screen w-60 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">

            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <h1 className="text-lg font-bold text-blue-600 tracking-tight">PlaceNet</h1>
                <p className="text-xs text-gray-400 mt-0.5">Placement Platform</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map(({ icon: Icon, label, active }) => (
                    <button
                        key={label}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition w-full text-left
              ${active
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </nav>

        </aside>
    )
}