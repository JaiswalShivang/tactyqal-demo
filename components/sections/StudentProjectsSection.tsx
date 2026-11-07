"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Category = "All" | "AgriTech" | "D2C" | "Commerce" | "Social" | "Media" | "EdTech";

type Project = {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  badge: string;
  badgeValue: string;
  story: string;
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
        <rect width="48" height="48" fill="#0D5C46" />
        <circle cx="24" cy="20" r="10" stroke="#D2FF28" strokeWidth="2" fill="none" />
        <path d="M24 10 L24 38" stroke="#D2FF28" strokeWidth="1.5" />
        <path d="M14 20 L34 20" stroke="#D2FF28" strokeWidth="1.5" />
        <path d="M17 14 L31 26" stroke="#D2FF28" strokeWidth="1" opacity="0.6" />
        <path d="M31 14 L17 26" stroke="#D2FF28" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#FF4F18" />
        <rect x="10" y="10" width="20" height="28" stroke="white" strokeWidth="2" fill="none" />
        <rect x="13" y="10" width="20" height="28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M14 18 L26 18 M14 22 L26 22 M14 26 L20 26" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
    bag: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#121316" />
        <path d="M16 20 L18 12 L30 12 L32 20 L32 36 L16 36 Z" stroke="#D2FF28" strokeWidth="2" fill="none" />
        <path d="M20 12 Q20 8 24 8 Q28 8 28 12" stroke="#D2FF28" strokeWidth="2" fill="none" />
        <path d="M20 24 L28 24" stroke="#D2FF28" strokeWidth="1.5" />
      </svg>
    ),
    paws: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#F6F4EE" />
        <ellipse cx="24" cy="28" rx="8" ry="6" stroke="#121316" strokeWidth="2" fill="none" />
        <circle cx="16" cy="20" r="3" stroke="#121316" strokeWidth="1.5" fill="none" />
        <circle cx="32" cy="20" r="3" stroke="#121316" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="17" r="3" stroke="#121316" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    audio: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#121316" />
        <circle cx="24" cy="24" r="12" stroke="#FF4F18" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="4" fill="#FF4F18" />
        <path d="M12 24 Q12 14 24 14" stroke="#FF4F18" strokeWidth="1.5" opacity="0.4" />
        <path d="M36 24 Q36 14 24 14" stroke="#FF4F18" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    converza: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect width="48" height="48" fill="#D2FF28" />
        <rect x="10" y="12" width="20" height="14" rx="2" stroke="#121316" strokeWidth="2" fill="none" />
        <path d="M14 30 L10 36 L20 32" stroke="#121316" strokeWidth="1.5" fill="none" />
        <circle cx="32" cy="30" r="6" stroke="#121316" strokeWidth="2" fill="none" />
        <path d="M30 30 L31 31 L34 28" stroke="#121316" strokeWidth="1.5" />
      </svg>
    ),
  };

  return <div className="w-12 h-12 flex-shrink-0">{configs[type]}</div>;
}

const PROJECTS: Project[] = [
  {
    id: "krishidrishti",
    name: "KrishiDrishti",
    category: "AgriTech",
    description: "AI-powered soil analysis & crop recommendation app that can impact millions of local farmers in India.",
    badge: "Millions Impacted",
    badgeValue: "Millions",
    story: "Built by a 15-year-old who grew up watching farmers in his village struggle with unpredictable yields. KrishiDrishti uses computer vision to analyse soil photos and recommend optimal crops and fertilisers—no lab equipment required.",
    metric: "Farmers Reached",
    metricValue: 2000,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="agri" />,
    screenshot: "/extracted/krishidrishti1.png",
  },
  {
    id: "one-last-chapter",
    name: "One Last Chapter",
    category: "D2C",
    description: "Book subscription service for kids. Started by a 13-year-old and is generating INR 1,00,000/month revenue.",
    badge: "₹1,00,000/mo Revenue",
    badgeValue: "₹1L/mo",
    story: "A 13-year-old who loved books but hated how hard it was to find the next great read built a curated monthly book box for kids aged 8–14. Within 3 months, she had 40 paying subscribers.",
    metric: "Monthly Revenue",
    metricValue: 100000,
    metricPrefix: "₹",
    metricSuffix: "",
    icon: <AppIcon type="book" />,
    screenshot: "/extracted/olc1.png",
  },
  {
    id: "elenor",
    name: "Elenor Vegan Handbags",
    category: "Commerce",
    description: "Corporate gifting platform that sells vegan handbags, started by a 16-year-old and generated INR 9,000 in the first week.",
    badge: "₹9,000 Week 1",
    badgeValue: "₹9K W1",
    story: "A 16-year-old with a passion for sustainable fashion built a B2B platform connecting ethical handbag manufacturers with corporate gifting buyers. First sale in 72 hours of launch.",
    metric: "Week 1 Revenue",
    metricValue: 9000,
    metricPrefix: "₹",
    metricSuffix: "",
    icon: <AppIcon type="bag" />,
    screenshot: "/extracted/elenor1.png",
  },
  {
    id: "paws-of-promise",
    name: "Paws of Promise",
    category: "Social",
    description: "App for virtual pet adoption that connects pet lovers with pets from shelters.",
    badge: "Shelter Network",
    badgeValue: "30 Shelters",
    story: "A 14-year-old animal lover built a platform that lets families virtually 'meet' shelter animals before visiting—reducing abandoned adoptions by 60% at partner shelters.",
    metric: "Shelters Partnered",
    metricValue: 30,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="paws" />,
    screenshot: "/extracted/pop1.png",
  },
  {
    id: "audionova",
    name: "AudioNova",
    category: "Media",
    description: "AI music and video production company built from scratch.",
    badge: "AI Studio",
    badgeValue: "AI Studio",
    story: "A 17-year-old music producer built an AI-assisted production studio that lets indie artists create professional-quality tracks without expensive studio time. 500+ tracks produced in year one.",
    metric: "Tracks Produced",
    metricValue: 500,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="audio" />,
    screenshot: "/extracted/audionova1.png",
  },
  {
    id: "converza",
    name: "Converza",
    category: "EdTech",
    description: "Spanish learning app featuring Luna, the friendly AI language learning bot.",
    badge: "Live AI Tutor",
    badgeValue: "AI Tutor",
    story: "A 15-year-old language enthusiast built an AI conversation partner that adapts to your learning pace and corrects your grammar naturally—without the embarrassment of making mistakes in front of a human tutor.",
    metric: "Active Learners",
    metricValue: 350,
    metricPrefix: "",
    metricSuffix: "+",
    icon: <AppIcon type="converza" />,
    screenshot: "/extracted/converza1.png",
  },
];

const CATEGORIES: Category[] = ["All", "AgriTech", "D2C", "Commerce", "Social", "Media", "EdTech"];

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      layout={!prefersReduced}
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="ticket-card p-5 cursor-pointer hover:shadow-tactile-signal group transition-all"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.name} project details`}
    >
      <div className="flex items-start gap-3 mb-3">
        {project.icon}
        <div className="flex-1 min-w-0">
          <div className="font-boomdang font-bold text-lg leading-tight">{project.name}</div>
          <div className="font-mono text-xs text-ink/40 stamp-text">{project.category}</div>
        </div>
        <span className="pill pill-volt text-xs flex-shrink-0">{project.badgeValue}</span>
      </div>

      <div className="border border-ink bg-paper mb-3 overflow-hidden shadow-tactile-sm">
        <div className="bg-sand border-b border-ink px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-signal" />
            <span className="w-2 h-2 rounded-full bg-volt" />
            <span className="w-2 h-2 rounded-full bg-emerald" />
          </div>
          <span className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">{project.id}.app</span>
        </div>
        <div className="relative aspect-[16/10] bg-white overflow-hidden">
          <img
            src={project.screenshot}
            alt={`${project.name} application preview`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      <p className="text-sm text-ink/70 leading-relaxed mb-3">{project.description}</p>

      <div className="flex items-center justify-between">
        <span className="verified-tag">✓ VERIFIED STUDENT</span>
        <span className="font-mono text-xs text-ink/40">View →</span>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useState(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (prefersReduced) {
      setCount(project.metricValue);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * project.metricValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });

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
        className="bg-paper border border-ink w-full max-w-lg p-8 relative"
        initial={prefersReduced ? {} : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={prefersReduced ? {} : { y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-start gap-4 mb-4">
          {project.icon}
          <div>
            <div className="font-boomdang text-2xl font-bold">{project.name}</div>
            <span className="pill text-xs">{project.category}</span>
          </div>
        </div>

        <div className="border border-ink bg-paper mb-5 overflow-hidden shadow-tactile-sm">
          <div className="bg-sand border-b border-ink px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-signal" />
              <span className="w-2.5 h-2.5 rounded-full bg-volt" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald" />
            </div>
            <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">{project.id}.tactyqal.app</span>
          </div>
          <div className="relative aspect-[16/10] bg-white overflow-hidden max-h-56">
            <img
              src={project.screenshot}
              alt={`${project.name} full preview`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        <div className="bg-volt border border-ink p-4 mb-6 text-center">
          <div className="font-mono text-xs text-ink/60 mb-1 stamp-text">{project.metric.toUpperCase()}</div>
          <div className="font-boomdang text-4xl font-bold">
            {project.metricPrefix}
            {count.toLocaleString("en-IN")}
            {project.metricSuffix}
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4">{project.story}</p>

        <div className="flex items-center justify-between pt-4 border-t border-ink/20">
          <span className="verified-tag">✓ VERIFIED STUDENT PROJECT</span>
          <span className="pill pill-volt text-xs">{project.badge}</span>
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
      className="py-24 px-4 bg-ivory border-y border-ink relative"
      aria-label="Student projects"
    >
      <div className="perforated-edge-top" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="section-number mb-3">№ 02 / 08 · PROOF OF WORK</div>
          <h2 className="headline-display mb-4">
            Real Students. Real Apps.{" "}
            <span className="volt-highlight">Real Success.</span>
          </h2>
          <p className="text-ink/60 max-w-xl">
            Every project below was built by a teenager in an 8-week cohort—with real users, real revenue, and a real impact.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-ink text-paper border-ink"
                  : "hover:bg-sand"
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
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

