import Navbar from "@/components/common/navbar";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-white to-orange-50/30 flex flex-col">
      <Navbar />
      {/* Background Blur */}
      <div className="absolute left-1/2 top-20 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-100 blur-[120px] opacity-40 pointer-events-none" />
      
      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
