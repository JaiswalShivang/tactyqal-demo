import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import StudentProjectsSection from "@/components/sections/StudentProjectsSection";
import BlueprintSection from "@/components/sections/BlueprintSection";
import WhyParentsSection from "@/components/sections/WhyParentsSection";
import FreeToolsSection from "@/components/sections/FreeToolsSection";
import StudentVoicesSection from "@/components/sections/StudentVoicesSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";
import { HeroTicker } from "@/components/MarqueeTicker";
import CustomCursor from "@/components/CustomCursor";
import HomepageBlogSection from "@/components/sections/HomepageBlogSection";
import { listPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { posts } = await listPosts({ published: true, limit: 100 });
  const serialized = JSON.parse(JSON.stringify(posts));

  return (
    <>
      <CustomCursor />

      <div>
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
          <HomepageBlogSection initialPosts={serialized} />
          <PricingSection />
          <FAQSection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
