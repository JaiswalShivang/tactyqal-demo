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
      className="relative min-h-[calc(100vh-3.5rem)] py-16 md:py-20 px-4 grid-bg overflow-hidden flex flex-col justify-center border-b border-ink"
      aria-label="Hero section"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-10 pointer-events-none mix-blend-luminosity hidden lg:block"
        src="https://www.tactyqal.com/application/assets/videos/kid_impact.mp4"
      />

      <div className="absolute inset-0 pointer-events-none select-none opacity-40" aria-hidden="true">
        <div className="absolute top-8 left-6 font-mono text-[12px] text-ink/30 font-bold">+</div>
        <div className="absolute top-8 right-6 font-mono text-[12px] text-ink/30 font-bold">+</div>
        <div className="absolute bottom-8 left-6 font-mono text-[12px] text-ink/30 font-bold">+</div>
        <div className="absolute bottom-8 right-6 font-mono text-[12px] text-ink/30 font-bold">+</div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-[58.333%] border-r border-dashed border-ink/20" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="section-number mb-4">№ 01 / 08 · THE PROGRAM</div>

          <h1 className="font-display font-extrabold text-[clamp(2.5rem,4.4vw,4.1rem)] tracking-[-0.035em] leading-[1.04] text-ink mb-6">
            Empower Your Kid To{" "}
            <span className="font-serif italic font-normal text-signal tracking-normal text-[1.1em]">
              Build
            </span>{" "}
            The Next App That Impacts Millions,{" "}
            <span className="whitespace-nowrap font-serif italic font-normal text-signal tracking-normal text-[1.05em]">
              in 8 Weeks.
            </span>
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {PILLS.map((pill) => (
              <span key={pill} className="pill text-xs bg-ivory/80">
                {pill}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8 border border-ink p-4 bg-ivory max-w-xl shadow-tactile-sm">
            <div className="text-center border-r border-ink/20 pr-2">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-signal tracking-tight">
                100+
              </div>
              <div className="text-[11px] text-ink/60 font-mono mt-1 stamp-text">
                STUDENTS MENTORED
              </div>
            </div>
            <div className="text-center border-r border-ink/20 px-2">
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                TOP
              </div>
              <div className="text-[11px] text-ink/60 font-mono mt-1 stamp-text">
                UNIVERSITY ADMITS
              </div>
            </div>
            <div className="text-center pl-2">
              <div className="font-display text-lg sm:text-xl font-bold tracking-tight">
                ₹ THOUSANDS
              </div>
              <div className="text-[11px] text-ink/60 font-mono mt-1 stamp-text">
                REAL REVENUE
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Link
              href="#contact"
              className="tactile-btn-signal px-7 py-3.5 text-sm font-semibold text-center tracking-wide"
            >
              Book Free Consultation
            </Link>
            <Link
              href="#student-projects"
              className="tactile-btn px-7 py-3.5 text-sm font-semibold text-center bg-ivory tracking-wide"
            >
              Explore Student Apps
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            ref={cardRef}
            className="ticket-card w-full max-w-md cursor-pointer bg-ivory"
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

            <div className="p-8">
              <div className="flex items-start justify-between mb-4 border-b border-ink/15 pb-4">
                <div>
                  <div className="font-mono text-xs text-ink/50 stamp-text mb-1">
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

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="pill pill-volt text-xs font-semibold">
                    Limited Time Offer
                  </span>
                  <span className="pill text-xs font-mono bg-paper text-ink">
                    Only 15 spots
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-mono text-2xl line-through text-ink/40">
                    ₹25,000
                  </span>
                  <span className="font-display text-[clamp(2.75rem,4.5vw,4.25rem)] font-extrabold text-signal leading-none tracking-tight">
                    ₹16,000
                  </span>
                </div>
                <div className="font-mono text-xs text-ink/50 stamp-text">
                  ONE-TIME · FULL PROGRAM ACCESS · TAX INCLUDED
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-6" />

              <div className="mb-6">
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-3">
                  Cohort Inclusions:
                </div>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">8 Weeks 1:1 Live Mentoring</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">Full-Stack App Production Launch</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-medium">100% Money-Back Guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <Barcode digits="160002500008" />
                <div className="font-mono text-[10px] text-ink/40 mt-1.5 tracking-wider">
                  160002500008-TQLAB-VERIFIED
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="#contact"
                  className="tactile-btn-signal w-full py-3 text-center font-semibold block text-sm tracking-wide"
                >
                  Enrol In 8-Week Cohort →
                </Link>
                <Link
                  href="#contact"
                  className="tactile-btn w-full py-2.5 text-center font-medium block text-xs bg-ivory tracking-wide"
                >
                  Schedule Founder Call ↗
                </Link>
              </div>

              <div className="mt-4 pt-3 border-t border-ink/15 flex items-center justify-between font-mono text-[11px] text-ink/70">
                <span className="flex items-center gap-1.5 font-semibold text-signal">
                  <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                  LIVE BUILDER COHORT
                </span>
                <span className="text-ink/50 uppercase">8 WEEKS · ZERO CODE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="perforated-edge mt-12" />
    </section>
  );
}
