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

const CHAPTERS = [
  { time: 0, label: "00:00 · The Thesis" },
  { time: 105, label: "05:40 · Idea Matrix" },
  { time: 495, label: "12:10 · First Customers" },
];

export default function WhyParentsSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(105);

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
          eyebrow="№ 04 / 09 · THE ADVANTAGE"
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          <div className="lg:col-span-6 border-[1.5px] border-[#121316] bg-[#121316] text-[#F6F4EE] shadow-[6px_6px_0px_0px_#FF4F18] p-5 sm:p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#2E3138] pb-3 mb-4 font-mono text-xs">
                <span className="text-signal font-bold tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                  FOUNDER MASTERCLASS // PARTHA CHAKRABORTY
                </span>
                <span className="text-paper/60 uppercase text-[11px] border border-[#2E3138] px-2 py-0.5">
                  YOUTUBE LIVE EVENT
                </span>
              </div>

              <div className="relative aspect-video border-y-[1.5px] border-[#2E3138] bg-[#0A0B0E] mb-4 overflow-hidden">
                {!isPlaying ? (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 cursor-pointer group flex flex-col justify-between p-4 bg-gradient-to-br from-[#12161A] via-[#0B0F14] to-[#0A0B0E] select-none"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-[#121316]/90 border border-white/20 px-2.5 py-1 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                        <span className="font-mono text-[10px] text-white font-bold tracking-wider">
                          A CH TRIBE EVENT · RECORDED MASTERCLASS
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-volt bg-black/80 px-2 py-0.5 border border-volt/30 font-bold">
                        12 MINS
                      </span>
                    </div>

                    <div className="relative z-10 my-auto text-center px-4">
                      <div className="inline-block border border-volt/40 bg-volt/10 text-volt font-mono text-[11px] font-bold px-3 py-1 mb-2">
                        SLIDE 09 // INVERSION TECHNIQUE
                      </div>
                      <h4 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-normal mb-3">
                        How to Come Up with Startup Ideas?
                      </h4>

                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          className="tactile-btn-signal px-5 py-2.5 text-xs font-bold flex items-center gap-2.5 shadow-tactile group-hover:scale-105 transition-transform"
                        >
                          <span className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-0.5" />
                          <span>Watch with Sound ▶</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[10px] text-paper/70">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Partha Chakraborty</span>
                        <span>· Founder, Tactyqal</span>
                      </div>
                      <div className="flex items-center gap-1 text-signal font-bold">
                        <span className="w-1.5 h-3 bg-signal animate-pulse" />
                        <span className="w-1.5 h-4 bg-signal animate-pulse delay-75" />
                        <span className="w-1.5 h-2 bg-signal animate-pulse delay-150" />
                        <span className="ml-1 uppercase">CLICK TO PLAY</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/UyUH06CfLbk?start=${selectedTimestamp}&autoplay=1&rel=0`}
                    title="How to Come Up with Startup Ideas? | A CH Tribe Event with Partha Chakraborty"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-normal mb-1 text-white">
                Startup Ideas 101 with Partha Chakraborty
              </h3>

              <p className="text-xs sm:text-sm text-paper/75 leading-relaxed tracking-normal mb-4">
                How teenagers spot real daily friction and turn it into scalable software before writing a single line of code.
              </p>
            </div>

            <div className="pt-3 border-t border-[#2E3138] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-paper/50 uppercase tracking-wider mr-1">
                  Chapters:
                </span>
                {CHAPTERS.map((ch) => (
                  <button
                    key={ch.time}
                    onClick={() => handlePlayChapter(ch.time)}
                    className={`font-mono text-[10px] px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedTimestamp === ch.time && isPlaying
                        ? "bg-signal text-white border-signal font-bold"
                        : "border-[#2E3138] text-paper/70 hover:border-paper bg-[#1C1E22]"
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>

              {isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="font-mono text-[10px] text-paper/60 hover:text-white border border-[#2E3138] px-2 py-0.5"
                >
                  Reset Poster
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {PILLARS_ROW1.map((p) => (
              <div
                key={p.num}
                className={`border-[1.5px] p-5 sm:p-6 flex flex-col justify-between h-full ${p.cardStyle}`}
              >
                <div>
                  <div className="font-mono text-xs mb-2 opacity-60 stamp-text">
                    № {p.num}
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-normal mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed tracking-normal opacity-85">
                    {p.desc}
                  </p>
                </div>
                <div className={`pt-3 mt-4 border-t border-current/15 font-mono text-[10px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                  VERIFIED PILLAR
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PILLARS_ROW2.map((p) => (
            <div
              key={p.num}
              className={`border-[1.5px] p-5 sm:p-6 flex flex-col justify-between h-full ${p.cardStyle}`}
            >
              <div>
                <div className="font-mono text-xs mb-2 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-normal mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed tracking-normal opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-3 mt-4 border-t border-current/15 font-mono text-[10px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
