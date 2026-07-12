import Navbar from "@/components/common/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Workflow from "@/components/landing/workflow";
import AIShowcase from "@/components/landing/ai-showcase";
import FAQ from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import ScrollReveal from "@/components/animations/scroll-reveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollReveal delay={0.1}><Hero /></ScrollReveal>
      <ScrollReveal delay={0.2}><Workflow /></ScrollReveal>
      <ScrollReveal delay={0.2}><AIShowcase /></ScrollReveal>
      <ScrollReveal delay={0.2}><FAQ /></ScrollReveal>
      <Footer />
    </>
  );
}