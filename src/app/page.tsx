import BackgroundDecor from "@/components/landing/BackgroundDecor";
import FaqSection from "@/components/landing/FaqSection";
import FeatureSection from "@/components/landing/FeatureSection";
import HeroSection from "@/components/landing/HeroSection";
import SiteFooter from "@/components/landing/SiteFooter";
import SiteHeader from "@/components/landing/SiteHeader";
import StepsSection from "@/components/landing/StepsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import UploadSection from "@/components/landing/UploadSection";
import { faqs, stats, steps, testimonials } from "@/data/landing";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <BackgroundDecor />

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24">
        <HeroSection stats={stats} />

        <TestimonialsSection testimonials={testimonials} />

        <FeatureSection />

        <StepsSection steps={steps} />

        <UploadSection />

        <FaqSection faqs={faqs} />
      </main>

      <SiteFooter />
    </div>
  );
}
