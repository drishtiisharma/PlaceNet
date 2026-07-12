import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "PlaceNet | Talent Portal",
  description: "AI Powered Placement Platform",
};

import { ResumeViewerWrapper } from "@/components/resume-viewer/resume-viewer-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TooltipProvider>
          <ResumeViewerWrapper>
            {children}
          </ResumeViewerWrapper>
        </TooltipProvider>
      </body>
    </html>
  );
}