"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

type Category = "All" | "AgriTech" | "D2C" | "Commerce" | "Social" | "Media" | "EdTech";

type Project = {
  id: string;
  name: string;
  founderAge: number;
  category: Exclude<Category, "All">;
  description: string;
  badge: string;
  badgeValue: string;
  story: string;
  techStack: string[];
  revenueOrImpact: string;
  metric: string;
  metricValue: number;
  metricPrefix: string;
  metricSuffix: string;
  icon: React.ReactNode;
  screenshot: string;
};

function AppIcon({ type }: { type: string }) {
  const configs: Record<string, React.ReactNode> = {
    agri: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#0F1B3D" />
        <circle cx="24" cy="20" r="10" stroke="#00F5D4" strokeWidth="2" fill="none" />
        <path d="M24 10 L24 38" stroke="#00F5D4" strokeWidth="1.5" />
        <path d="M14 20 L34 20" stroke="#00F5D4" strokeWidth="1.5" />
        <path d="M17 14 L31 26" stroke="#00F5D4" strokeWidth="1" opacity="0.6" />
        <path d="M31 14 L17 26" stroke="#00F5D4" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#FF3D88" />
        <rect x="10" y="10" width="20" height="28" stroke="white" strokeWidth="2" fill="none" />
        <rect x="13" y="10" width="20" height="28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M14 18 L26 18 M14 22 L26 22 M14 26 L20 26" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
    bag: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#0F1B3D" />
        <path d="M16 20 L18 12 L30 12 L32 20 L32 36 L16 36 Z" stroke="#FF3D88" strokeWidth="2" fill="none" />
        <path d="M20 12 Q20 8 24 8 Q28 8 28 12" stroke="#FF3D88" strokeWidth="2" fill="none" />
        <path d="M20 24 L28 24" stroke="#FF3D88" strokeWidth="1.5" />
      </svg>
    ),
    paws: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#F4F6FB" />
        <ellipse cx="24" cy="28" rx="8" ry="6" stroke="#0F1B3D" strokeWidth="2" fill="none" />
        <circle cx="16" cy="20" r="3" stroke="#0F1B3D" strokeWidth="1.5" fill="none" />
        <circle cx="32" cy="20" r="3" stroke="#0F1B3D" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="17" r="3" stroke="#0F1B3D" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    audio: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#0F1B3D" />
        <circle cx="24" cy="24" r="12" stroke="#FF3D88" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="4" fill="#FF3D88" />
        <path d="M12 24 Q12 14 24 14" stroke="#FF3D88" strokeWidth="1.5" opacity="0.4" />
        <path d="M36 24 Q36 14 24 14" stroke="#FF3D88" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    converza: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#FFE4EF" />
        <rect x="10" y="12" width="20" height="14" rx="2" stroke="#FF3D88" strokeWidth="2" fill="none" />
        <path d="M14 30 L10 36 L20 32" stroke="#FF3D88" strokeWidth="1.5" fill="none" />
        <circle cx="32" cy="30" r="6" stroke="#FF3D88" strokeWidth="2" fill="none" />
        <path d="M30 30 L31 31 L34 28" stroke="#FF3D88" strokeWidth="1.5" />
      </svg>
    ),
  };

  return <div className="w-10 h-10 flex-shrink-0">{configs[type]}</div>;
}

const PROJECTS: Project[] = [
  {
    id: "krishidrishti",
    name: "KrishiDrishti",
    founderAge: 15,
    category: "AgriTech",
    description: "AI-powered soil analysis & crop recommendation app that can impact millions of local farmers in India.",
    badge: "Millions Impacted",
    badgeValue: "Millions",
    story: "Built by a 15-year-old who grew up watching farmers in his village struggle with unpredictable yields. KrishiDrishti uses computer vision to analyse soil photos and recommend optimal crops and fertilisers—no lab equipment required.",
    techStack: ["FlutterFlow", "OpenAI Vision API", "Supabase", "FastAPI"],
    revenueOrImpact: "2,000+ farmers reached across 14 agricultural districts in Maharashtra",
    metric: "Farmers Reached",
    metricValue: 2000,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="agri" />,
    screenshot: "/extracted/krishidrishti1.webp",
  },
  {
    id: "one-last-chapter",
    name: "One Last Chapter",
    founderAge: 13,
    category: "D2C",
    description: "Book subscription service for kids. Started by a 13-year-old and is generating INR 1,00,000/month revenue.",
    badge: "₹1,00,000/mo Revenue",
    badgeValue: "₹1L/mo",
    story: "A 13-year-old who loved books but hated how hard it was to find the next great read built a curated monthly book box for kids aged 8–14. Within 3 months, she had 40 paying subscribers.",
    techStack: ["Bubble", "Razorpay / Stripe", "Airtable", "Make.com"],
    revenueOrImpact: "₹1,00,000/mo recurring subscription revenue with 40+ active members",
    metric: "Monthly Revenue",
    metricValue: 100000,
    metricPrefix: "₹",
    metricSuffix: "",
    icon: <AppIcon type="book" />,
    screenshot: "/extracted/olc1.webp",
  },
  {
    id: "elenor",
    name: "Elenor Vegan Handbags",
    founderAge: 16,
    category: "Commerce",
    description: "Corporate gifting platform that sells vegan handbags, started by a 16-year-old and generated INR 9,000 in the first week.",
    badge: "₹9,000 Week 1",
    badgeValue: "₹9K W1",
    story: "A 16-year-old with a passion for sustainable fashion built a B2B platform connecting ethical handbag manufacturers with corporate gifting buyers. First sale in 72 hours of launch.",
    techStack: ["Shopify / Webflow", "Shiprocket", "WhatsApp Commerce API"],
    revenueOrImpact: "₹9,000 in Week 1; 3 corporate gifting contracts closed",
    metric: "Week 1 Revenue",
    metricValue: 9000,
    metricPrefix: "₹",
    metricSuffix: "",
    icon: <AppIcon type="bag" />,
    screenshot: "/extracted/elenor1.webp",
  },
  {
    id: "paws-of-promise",
    name: "Paws of Promise",
    founderAge: 14,
    category: "Social",
    description: "App for virtual pet adoption that connects pet lovers with pets from shelters.",
    badge: "Shelter Network",
    badgeValue: "30 Shelters",
    story: "A 14-year-old animal lover built a platform that lets families virtually 'meet' shelter animals before visiting—reducing abandoned adoptions by 60% at partner shelters.",
    techStack: ["Softr", "Airtable", "Twilio SMS", "Cal.com"],
    revenueOrImpact: "30+ partner shelters; 60% reduction in abandoned pet adoptions",
    metric: "Shelters Partnered",
    metricValue: 30,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="paws" />,
    screenshot: "/extracted/pop1.webp",
  },
  {
    id: "audionova",
    name: "AudioNova",
    founderAge: 16,
    category: "Media",
    description: "AI music and video production company built from scratch.",
    badge: "Media Studio",
    badgeValue: "Studio Live",
    story: "A 16-year-old musician combined AI composition tools with a client portal to produce custom royalty-free soundtracks for YouTubers and indie game developers.",
    techStack: ["ElevenLabs", "Suno AI API", "Bubble", "Stripe"],
    revenueOrImpact: "15 creator clients; ₹45,000 in custom audio productions",
    metric: "Tracks Produced",
    metricValue: 120,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="audio" />,
    screenshot: "/extracted/audionova1.webp",
  },
  {
    id: "converza",
    name: "Converza",
    founderAge: 15,
    category: "EdTech",
    description: "AI communication mentor that helps students practice debate, public speaking, and interviews.",
    badge: "Speech AI",
    badgeValue: "AI Live",
    story: "A 15-year-old debate champion built an AI sparring partner that listens to student speeches, scores argument logic in real time, and provides constructive feedback.",
    techStack: ["Retool", "Vapi.ai", "OpenAI Realtime", "PostgreSQL"],
    revenueOrImpact: "500+ active beta testers; 98.4% speech-to-text accuracy",
    metric: "Speeches Analyzed",
    metricValue: 3500,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="converza" />,
    screenshot: "/extracted/converza1.webp",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "AgriTech",
  "D2C",
  "Commerce",
  "Social",
  "Media",
  "EdTech",
];

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="ticket-card p-6 flex flex-col justify-between hover:shadow-tactile-signal transition-all cursor-pointer group bg-ivory"
      onClick={onClick}
      whileHover={prefersReduced ? {} : { y: -3 }}
      initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {project.icon}
            <div>
              <h3 className="font-display font-bold text-lg tracking-tight group-hover:text-signal transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="font-mono text-[11px] text-ink/40">·</span>
                <span className="font-mono text-[11px] text-signal font-semibold">
                  Age {project.founderAge}
                </span>
              </div>
            </div>
          </div>
          <span className="pill pill-volt text-[11px] font-semibold">
            {project.badgeValue}
          </span>
        </div>

        <div className="border border-ink bg-paper mb-4 overflow-hidden shadow-tactile-sm">
          <div className="bg-sand border-b border-ink px-3 py-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-signal inline-block" />
              <span className="w-2 h-2 rounded-full bg-volt inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald inline-block" />
            </div>
            <span className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">
              {project.id}.app
            </span>
          </div>
          <div className="relative aspect-[16/10] bg-white overflow-hidden">
            <img
              src={project.screenshot}
              alt={`${project.name} interface screenshot`}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        <p className="text-xs text-ink/75 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
      </div>

      <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
        <span className="font-mono text-xs text-ink/60">
          {project.metric}:{" "}
          <strong className="text-ink font-bold">
            {project.metricPrefix}
            {project.metricValue.toLocaleString("en-IN")}
            {project.metricSuffix}
          </strong>
        </span>
        <span className="font-mono text-xs text-signal font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          View Details →
        </span>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <motion.div
        ref={modalRef}
        className="bg-white border-2 border-[#0F1B3D] w-full max-w-4xl relative z-10 shadow-[10px_10px_0px_0px_#FF3D88] overflow-hidden max-h-[92vh] flex flex-col my-auto"
        initial={prefersReduced ? {} : { y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={prefersReduced ? {} : { y: 25, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0F1B3D] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-[#0F1B3D] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
              {project.icon}
            </div>
            <div className="flex flex-wrap items-center gap-2 truncate">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">
                {project.name}
              </span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/90">
                {project.category}
              </span>
              <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE4EF] text-[#FF3D88] border border-[#FF3D88]">
                Founder: Age {project.founderAge}
              </span>
              <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4] hidden sm:inline-block">
                {project.badge}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white text-[#0F1B3D] hover:bg-[#FF3D88] hover:text-white flex items-center justify-center font-bold border border-[#0F1B3D] transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 gap-6 items-stretch overflow-y-auto">
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="border border-[#0F1B3D] bg-white overflow-hidden shadow-[3px_3px_0px_#0F1B3D] mb-4">
                <div className="bg-[#F4F6FB] border-b border-[#0F1B3D] px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#0F1B3D]/70">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF3D88] inline-block" />
                    <span className="w-2 h-2 rounded-full bg-[#FFE4EF] border border-[#0F1B3D] inline-block" />
                    <span className="w-2 h-2 rounded-full bg-[#00D2B4] inline-block" />
                  </div>
                  <span className="truncate max-w-[200px]">https://{project.id}.tactyqal.app</span>
                </div>
                <div className="relative w-full aspect-[4/3] bg-[#0F1B3D] overflow-hidden">
                  <img
                    src={project.screenshot}
                    alt={`${project.name} full preview`}
                    className="w-full h-full object-cover object-top block"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono border border-[#0F1B3D] p-2.5 bg-[#F4F6FB] shadow-[2px_2px_0px_#0F1B3D]">
                <div>
                  <div className="text-[10px] text-[#0F1B3D]/50 uppercase">Time to MVP</div>
                  <div className="text-xs font-bold text-[#0F1B3D] mt-0.5">6 Weeks</div>
                </div>
                <div className="border-x border-[#0F1B3D]/20 px-1">
                  <div className="text-[10px] text-[#0F1B3D]/50 uppercase">Code Written</div>
                  <div className="text-xs font-bold text-[#0F1B3D] mt-0.5">0 Lines</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#0F1B3D]/50 uppercase">Status</div>
                  <div className="text-xs font-bold text-[#FF3D88] mt-0.5">Monetized</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F4F6FB] border border-[#0F1B3D] p-3 shadow-[2px_2px_0px_#0F1B3D]">
                  <div className="font-mono text-[10px] text-[#0F1B3D]/60 uppercase tracking-wider mb-0.5">
                    {project.metric.toUpperCase()}
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-[#FF3D88] tracking-tight">
                    {project.metricPrefix}
                    {project.metricValue.toLocaleString("en-IN")}
                    {project.metricSuffix}
                  </div>
                </div>
                <div className="bg-[#F4F6FB] border border-[#0F1B3D] p-3 shadow-[2px_2px_0px_#0F1B3D]">
                  <div className="font-mono text-[10px] text-[#0F1B3D]/60 uppercase tracking-wider mb-0.5">
                    OUTCOME &amp; IMPACT
                  </div>
                  <div className="font-mono text-xs font-bold text-[#0F1B3D] leading-snug line-clamp-3">
                    {project.revenueOrImpact}
                  </div>
                </div>
              </div>

              <div className="mb-4 bg-white border border-[#0F1B3D] p-3 shadow-[2px_2px_0px_#0F1B3D]">
                <div className="font-mono text-[10px] text-[#0F1B3D]/70 uppercase tracking-wider font-bold mb-2">
                  TECH STACK BUILT IN 8 WEEKS (NO-CODE + AI)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs bg-[#F4F6FB] border border-[#0F1B3D]/30 px-2.5 py-1 text-[#0F1B3D] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 text-[#0F1B3D]/85">{project.story}</p>
            </div>

            <div className="pt-2">
              <Link
                href="#contact"
                onClick={onClose}
                className="w-full py-3.5 text-center font-bold block text-sm tracking-wide bg-[#FF3D88] text-white hover:bg-[#E62E76] border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#0F1B3D] transition-all cursor-pointer"
              >
                Build an App Like This in Cohort #04 →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function StudentProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section
      id="student-projects"
      className="py-16 md:py-22 px-4 bg-ivory border-y border-ink relative"
      aria-label="Student projects"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Real Students. Real Apps. Real Success."
          accent="Success."
          description="Every project below was built by a teenager in an 8-week cohort—with real users, real revenue, and a real impact."
        />

        <div
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill text-xs transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-ink text-white border-ink font-semibold"
                  : "bg-paper text-ink/80 hover:bg-sand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
