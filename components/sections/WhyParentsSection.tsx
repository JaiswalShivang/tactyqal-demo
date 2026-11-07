"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const PILLARS_ROW1 = [
  {
    num: "01",
    title: "1:1 Personalized Mentoring",
    desc: "Every student gets dedicated, expert guidance from founders. No group lectures.",
    cardStyle: "bg-signal text-white border-ink shadow-tactile-sm",
    badgeStyle: "text-white/80",
  },
  {
    num: "02",
    title: "Full Stack App with No-Code",
    desc: "Build production-ready apps using modern no-code platforms and AI tools.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-signal font-bold",
  },
  {
    num: "03",
    title: "Proven Track Record",
    desc: "100+ students mentored, real revenue, and top university admits.",
    cardStyle: "bg-sand text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-emerald font-bold",
  },
  {
    num: "04",
    title: "University Admission Edge",
    desc: "Stand out in Ivy League and top applications with verifiable software and real traction.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-ink/60",
  },
];

const PILLARS_ROW2 = [
  {
    num: "05",
    title: "Revenue Generation",
    desc: "Students learn the economics of digital products: Stripe billing, pricing, and monetization.",
    cardStyle: "bg-sand text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-signal font-bold",
  },
  {
    num: "06",
    title: "Life Long Support",
    desc: "Alumni network access, ongoing founder mentorship, and introductions after cohort graduation.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-ink/60",
  },
  {
    num: "07",
    title: "Pitch & Presentation Skills",
    desc: "Master storytelling, build an investor pitch deck, and launch to thousands on Product Hunt.",
    cardStyle: "bg-ink text-white border-ink shadow-tactile-sm",
    badgeStyle: "text-volt font-bold",
  },
];

export default function WhyParentsSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(105);

  const CHAPTERS = [
    { time: 0, label: "00:00 · The Builder Thesis" },
    { time: 105, label: "01:45 · Spotting Real Problems" },
    { time: 260, label: "04:20 · Validating Before Code" },
    { time: 495, label: "08:15 · First Paying Customers" },
    { time: 690, label: "11:30 · 8-Week Launch Map" },
  ];

  const TAKEAWAYS = [
    "Solve problems people are already paying to solve.",
    "No-code lets high-schoolers ship in days, not months.",
    "Real revenue is the ultimate university admission proof.",
  ];

  const handlePlayChapter = (time: number) => {
    setSelectedTimestamp(time);
    setIsPlaying(true);
  };

  return (
    <section
      id="why-parents"
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink relative"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 04 / 08 · THE ADVANTAGE"
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch mb-8">
          <div className="col-span-12 md:col-span-6 md:row-span-2 border-[1.5px] border-ink bg-ivory text-ink p-6 sm:p-7 flex flex-col justify-between shadow-tactile">
            <div>
              <div className="flex items-center justify-between border-b border-ink/15 pb-3 mb-4">
                <span className="font-mono text-xs text-signal font-bold tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                  FOUNDER MASTERCLASS
                </span>
                <span className="font-mono text-xs text-ink/60 uppercase">
                  STARTUP IDEAS 101
                </span>
              </div>

              <div className="relative aspect-video border-[1.5px] border-ink bg-black mb-5 overflow-hidden shadow-tactile-sm">
                {!isPlaying ? (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 cursor-pointer group flex flex-col justify-between p-4"
                  >
                    <img
                      src="https://img.youtube.com/vi/UyUH06CfLbk/hqdefault.jpg"
                      alt="Startup Ideas 101 Masterclass Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/40 transition-colors" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="pill pill-volt text-[11px] font-semibold">
                        A CH Tribe Event · Live Recording
                      </span>
                      <span className="font-mono text-[11px] text-white bg-ink/70 px-2 py-0.5 border border-white/20">
                        12 MIN
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                      <div className="w-16 h-16 rounded-full bg-signal text-white flex items-center justify-center shadow-tactile group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="mt-3 font-mono text-xs text-white uppercase tracking-wider font-bold bg-ink/80 px-3 py-1 border border-white/20">
                        CLICK TO PLAY MASTERCLASS INLINE
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="font-display font-bold text-sm text-white drop-shadow">
                        Partha Chakraborty · Founder, Tactyqal Labs
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/UyUH06CfLbk?start=${selectedTimestamp}&autoplay=1&rel=0`}
                    title="How to Come Up with Startup Ideas? | A CH Tribe Event with Partha Chakraborty"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              <h3 className="font-display font-bold text-2xl tracking-tight mb-2 text-ink">
                Startup Ideas 101 with Partha Chakraborty
              </h3>

              <p className="text-sm text-ink/75 leading-relaxed mb-4">
                Watch our founder break down how teenagers can spot overlooked problems in their daily lives and turn them into scalable digital products.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {CHAPTERS.map((ch) => (
                  <button
                    key={ch.time}
                    onClick={() => handlePlayChapter(ch.time)}
                    className={`font-mono text-[11px] px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedTimestamp === ch.time && isPlaying
                        ? "bg-signal text-white border-signal font-bold"
                        : "border-ink/20 text-ink/80 hover:border-ink bg-sand"
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-ink/15 space-y-2">
              <div className="font-mono text-[11px] text-ink/50 uppercase tracking-wider mb-2">
                Core Takeaways:
              </div>
              {TAKEAWAYS.map((point) => (
                <div key={point} className="flex items-start gap-2 text-xs text-ink/85">
                  <span className="text-signal font-bold">▸</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {PILLARS_ROW1.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-3 border-[1.5px] p-6 flex flex-col justify-between ${p.cardStyle}`}
            >
              <div>
                <div className="font-mono text-xs mb-3 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-4 mt-4 border-t border-current/15 font-mono text-[11px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}

          {PILLARS_ROW2.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-4 border-[1.5px] p-6 flex flex-col justify-between ${p.cardStyle}`}
            >
              <div>
                <div className="font-mono text-xs mb-3 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-4 mt-4 border-t border-current/15 font-mono text-[11px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
