"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import StudentProjectsSection from "@/components/sections/StudentProjectsSection";
import BlueprintSection from "@/components/sections/BlueprintSection";
import WhyParentsSection from "@/components/sections/WhyParentsSection";
import FreeToolsSection from "@/components/sections/FreeToolsSection";
import StudentVoicesSection from "@/components/sections/StudentVoicesSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/Footer";
import { HeroTicker } from "@/components/MarqueeTicker";
import TicketIntro from "@/components/TicketIntro";
import CustomCursor from "@/components/CustomCursor";
import HomepageBlogSection from "@/components/sections/HomepageBlogSection";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [introShown, setIntroShown] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem("tactyqal-intro-seen");
    if (hasSeenIntro) {
      setIntroShown(true);
      setShowContent(true);
    } else {
      setIntroShown(false);
    }
  }, []);

  const handleIntroDone = () => {
    sessionStorage.setItem("tactyqal-intro-seen", "1");
    setShowContent(true);
    setIntroShown(true);
  };

  return (
    <>
      {mounted && <CustomCursor />}

      {mounted && !introShown && (
        <TicketIntro onDone={handleIntroDone} />
      )}

      <div
        className={`transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Header />

        <div className="pt-14">
          <HeroTicker />
        </div>

        <main id="main-content">
          <HeroSection />
          <StudentProjectsSection />
          <BlueprintSection />
          <WhyParentsSection />
          <FreeToolsSection />
          <StudentVoicesSection />
          <HomepageBlogSection />
          <PricingSection />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
