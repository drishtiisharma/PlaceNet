import Navbar from "@/components/common/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Workflow from "@/components/landing/workflow";
import AIShowcase from "@/components/landing/ai-showcase";
import FAQ from "@/components/landing/faq";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Workflow />
      <AIShowcase />
      <FAQ />
      <Footer />
    </>
  );
}