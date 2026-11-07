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
import { ArchitecturalDivider } from "@/components/ArchitecturalDivider";

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
          <ArchitecturalDivider
            code="SEC_01 // PROOF_OF_WORK"
            label="6 LIVE STUDENT APPS // PRODUCTION SPEC"
          />
          <StudentProjectsSection />
          <ArchitecturalDivider
            code="SEC_02 // CURRICULUM_SPEC"
            label="8-WEEK MILESTONE BLUEPRINT"
          />
          <BlueprintSection />
          <ArchitecturalDivider
            code="SEC_03 // THE_ADVANTAGE"
            label="PARENT & FOUNDER ALIGNMENT"
          />
          <WhyParentsSection />
          <FreeToolsSection />
          <ArchitecturalDivider
            code="SEC_05 // ALUMNI_CORPS"
            label="100+ STUDENT TESTIMONIALS"
          />
          <StudentVoicesSection />
          <ArchitecturalDivider
            code="SEC_06 // EDITORIAL_DESK"
            label="FOUNDER BLUEPRINTS & ESSAYS"
          />
          <HomepageBlogSection />
          <PricingSection />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
