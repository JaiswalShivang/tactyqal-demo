"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

function Barcode({ digits }: { digits: string }) {
  const heights = Array.from(digits).map((d) => 18 + parseInt(d) * 2.2);
  return (
    <div className="barcode" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="barcode-bar"
          style={{ height: `${h}px`, width: i % 3 === 0 ? "3px" : "2px" }}
        />
      ))}
      <div className="barcode-bar" style={{ height: "36px", width: "4px" }} />
      {heights.slice().reverse().map((h, i) => (
        <div
          key={`r${i}`}
          className="barcode-bar"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * 5, y: -dx * 5 });
    setHighlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHighlight({ x: 50, y: 50 });
  };

  const PILLS = [
    "1:1 Mentoring",
    "Idea To Full-Stack App",
    "No Coding",
    "Admissions To The Best Colleges",
    "Grants",
    "Media Coverage",
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-3.5rem)] py-12 md:py-16 px-4 bg-[#0B0C0E] text-[#F6F4EE] overflow-hidden flex flex-col justify-center border-b border-[#2E3138]"
      aria-label="Hero section"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-45 scale-[1.02] pointer-events-none"
        style={{ filter: "contrast(1.08) saturate(1.1)" }}
        src="https://www.tactyqal.com/application/assets/videos/kid_impact.mp4"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/95 via-[#0B0C0E]/75 to-[#0B0C0E]/45 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:64px_64px] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0E]/40 via-transparent to-[#0B0C0E]/80 z-0 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute top-6 left-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute top-6 right-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute bottom-6 left-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute bottom-6 right-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-[58.333%] border-r border-dashed border-white/10" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="font-mono text-xs text-volt font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
            № 01 / 08 · THE PROGRAM
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.4rem,4.2vw,3.9rem)] tracking-[-0.035em] leading-[1.04] text-[#F6F4EE] mb-5">
            Empower Your Kid To{" "}
            <span className="font-serif italic font-normal text-signal tracking-normal text-[1.1em]">
              Build
            </span>{" "}
            The Next App That Impacts Millions,{" "}
            <span className="whitespace-nowrap font-serif italic font-normal text-signal tracking-normal text-[1.05em]">
              in 8 Weeks.
            </span>
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {PILLS.map((pill) => (
              <span
                key={pill}
                className="text-xs px-3 py-1 rounded-full bg-[#121316]/85 backdrop-blur-sm border border-[#F6F4EE]/25 text-[#F6F4EE] hover:border-[#FF4F18] transition-colors font-sans"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 border-[1.5px] border-[#121316] p-4 bg-[#F6F4EE] text-[#121316] max-w-xl shadow-[4px_4px_0px_0px_#FF4F18]">
            <div className="text-center border-r border-ink/20 pr-2">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-signal tracking-tight">
                100+
              </div>
              <div className="text-[10px] sm:text-[11px] text-ink/70 font-mono mt-0.5 stamp-text">
                STUDENTS MENTORED
              </div>
            </div>
            <div className="text-center border-r border-ink/20 px-2">
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                TOP
              </div>
              <div className="text-[10px] sm:text-[11px] text-ink/70 font-mono mt-0.5 stamp-text">
                UNIVERSITY ADMITS
              </div>
            </div>
            <div className="text-center pl-2">
              <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
                ₹ THOUSANDS
              </div>
              <div className="text-[10px] sm:text-[11px] text-ink/70 font-mono mt-0.5 stamp-text">
                REAL REVENUE
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Link
              href="#contact"
              className="px-7 py-3 text-sm font-bold text-center tracking-wide bg-signal text-white border-2 border-white shadow-[4px_4px_0px_0px_#F6F4EE] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#F6F4EE] transition-all cursor-pointer"
            >
              Book Free Consultation
            </Link>
            <Link
              href="#student-projects"
              className="px-7 py-3 text-sm font-bold text-center tracking-wide bg-white text-ink border-2 border-ink shadow-[4px_4px_0px_0px_#FF4F18] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#FF4F18] transition-all cursor-pointer"
            >
              Explore Student Apps
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            ref={cardRef}
            className="ticket-card w-full max-w-md cursor-pointer bg-white text-ink border-2 border-[#121316] shadow-[8px_8px_0px_0px_#FF4F18]"
            style={
              prefersReduced
                ? {}
                : {
                    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: "transform 0.15s ease-out",
                  }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {!prefersReduced && (
              <div
                className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-150"
                style={{
                  background: `radial-gradient(circle at ${highlight.x}% ${highlight.y}%, white 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="ticket-notch ticket-notch-left" />
            <div className="ticket-notch ticket-notch-right" />

            <div className="p-6">
              <div className="flex items-start justify-between mb-3 border-b border-ink/15 pb-3">
                <div>
                  <div className="font-mono text-xs text-ink/50 stamp-text mb-0.5">
                    ADMISSION TICKET
                  </div>
                  <div className="font-display text-2xl font-bold tracking-tight">
                    8-WEEK COHORT
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-ink/50 stamp-text">
                    SEAT NO.
                  </div>
                  <div className="font-mono font-bold text-lg text-signal">
                    #04
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="pill pill-volt text-xs font-semibold">
                    Limited Time Offer
                  </span>
                  <span className="pill text-xs font-mono bg-paper text-ink">
                    Only 15 spots
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-1">
                  <span className="font-mono text-2xl line-through text-ink/40">
                    ₹25,000
                  </span>
                  <span className="font-display text-[clamp(2.5rem,4vw,3.75rem)] font-extrabold text-signal leading-none tracking-tight">
                    ₹16,000
                  </span>
                </div>
                <div className="font-mono text-[11px] text-ink/50 stamp-text">
                  ONE-TIME · FULL PROGRAM ACCESS · TAX INCLUDED
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-3.5" />

              <div className="mb-4">
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-2">
                  Cohort Inclusions:
                </div>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">8 Weeks 1:1 Live Mentoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">Full-Stack App Production Launch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">100% Money-Back Guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <Barcode digits="160002500008" />
                <div className="font-mono text-[10px] text-ink/40 mt-1 tracking-wider">
                  160002500008-TQLAB-VERIFIED
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="#contact"
                  className="tactile-btn-signal w-full py-2.5 text-center font-semibold block text-sm tracking-wide"
                >
                  Enrol In 8-Week Cohort →
                </Link>
                <Link
                  href="#contact"
                  className="tactile-btn w-full py-2 text-center font-medium block text-xs bg-ivory tracking-wide"
                >
                  Schedule Founder Call ↗
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#121316]/90 backdrop-blur-md border border-white/20 hover:border-signal px-3 py-1.5 text-white font-mono text-[11px] shadow-tactile-sm transition-colors cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="text-white/80 group-hover:text-white">LIVE COHORT FEED // SOUND OFF</span>
          <span className="text-volt font-bold ml-1">Expand ↗</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="ticket-card bg-ivory max-w-2xl w-full p-5 border-2 border-ink shadow-tactile relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/20 font-mono text-xs">
              <span className="font-bold text-signal flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                TACTYQAL BUILDER COHORT REEL · 1:1 MENTORING
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="border border-ink px-2.5 py-1 hover:bg-ink hover:text-white font-bold transition-colors cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>
            <div className="aspect-video w-full bg-ink border border-ink overflow-hidden">
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
                src="https://www.tactyqal.com/application/assets/videos/kid_impact.mp4"
              />
            </div>
          </div>
        </div>
      )}

      <div className="perforated-edge mt-8" />
    </section>
  );
}
