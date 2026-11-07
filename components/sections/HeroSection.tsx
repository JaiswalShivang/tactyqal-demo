"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

function CountUp({
  target,
  duration = 1500,
  prefix = "",
  suffix = "",
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || hasRun.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasRun.current) {
          hasRun.current = true;

          if (prefersReduced) {
            setCurrent(target);
            return;
          }

          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, prefersReduced]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {current.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function Barcode({ digits }: { digits: string }) {
  const heights = Array.from(digits).map((d) => 20 + parseInt(d) * 3);
  return (
    <div className="barcode" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="barcode-bar"
          style={{ height: `${h}px`, width: i % 3 === 0 ? "3px" : "2px" }}
        />
      ))}
      <div className="barcode-bar" style={{ height: "40px", width: "4px" }} />
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
    setTilt({ x: dy * 6, y: -dx * 6 });
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
      className="relative min-h-screen pt-24 pb-16 px-4 grid-bg overflow-hidden"
      aria-label="Hero section"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div className="pt-8">
          <div className="section-number mb-6">№ 01 / 08 · THE PROGRAM</div>

          <h1 className="headline-display mb-8">
            Empower Your Kid To{" "}
            <span className="volt-highlight">Build</span> The Next App That
            Impacts Millions, in 8 Weeks.
          </h1>

          <div className="flex flex-wrap gap-2 mb-10">
            {PILLS.map((pill) => (
              <span key={pill} className="pill text-xs">
                {pill}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 border border-ink p-4 bg-ivory">
            <div className="text-center border-r border-ink/20">
              <div className="font-boomdang text-3xl font-bold text-signal">
                100+
              </div>
              <div className="text-xs text-ink/60 font-mono mt-1 stamp-text">
                STUDENTS MENTORED
              </div>
            </div>
            <div className="text-center border-r border-ink/20">
              <div className="font-boomdang text-2xl font-bold">TOP</div>
              <div className="text-xs text-ink/60 font-mono mt-1 stamp-text">
                UNIVERSITY ADMITS
              </div>
            </div>
            <div className="text-center">
              <div className="font-boomdang text-xl font-bold">₹ THOUSANDS</div>
              <div className="text-xs text-ink/60 font-mono mt-1 stamp-text">
                REAL REVENUE
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="#pricing" className="tactile-btn-signal px-6 py-3 text-base font-semibold text-center">
              Book Free Consultation
            </Link>
            <Link href="#student-projects" className="tactile-btn px-6 py-3 text-base font-semibold text-center bg-ivory">
              Explore Student Apps
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-8">
          <motion.div
            ref={cardRef}
            className="ticket-card w-full max-w-sm cursor-pointer"
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
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {!prefersReduced && (
              <div
                className="absolute inset-0 opacity-10 pointer-events-none rounded-none transition-all duration-150"
                style={{
                  background: `radial-gradient(circle at ${highlight.x}% ${highlight.y}%, white 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="ticket-notch ticket-notch-left" />
            <div className="ticket-notch ticket-notch-right" />

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-ink/40 stamp-text mb-1">
                    ADMISSION TICKET
                  </div>
                  <div className="font-boomdang text-xl font-bold">
                    8-WEEK COHORT
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-ink/40 stamp-text">
                    SEAT NO.
                  </div>
                  <div className="font-mono font-bold text-lg">
                    #{Math.floor(Math.random() * 15 + 1).toString().padStart(2, "0")}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-4" />

              <div className="mb-4">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="pill pill-volt text-xs">Limited Time Offer</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl line-through text-ink/40">
                    ₹25,000
                  </span>
                  <span className="font-boomdang text-5xl font-bold text-signal leading-none">
                    <CountUp target={16000} prefix="₹" duration={1200} />
                  </span>
                </div>
                <div className="font-mono text-xs text-ink/50 mt-1 stamp-text">
                  ONE-TIME · FULL PROGRAM ACCESS
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-4" />

              <div className="mb-4">
                <Barcode digits="160002500008" />
                <div className="font-mono text-xs text-ink/30 mt-1">
                  160002500008-TQLAB
                </div>
              </div>

              <div className="bg-emerald text-white text-xs font-mono px-3 py-2 stamp-text text-center">
                100% RESULTS GUARANTEED OR MONEY BACK
              </div>

              <div className="mt-3 font-mono text-xs text-ink/50 text-center stamp-text">
                ONLY 15 SPOTS AVAILABLE FOR THE MONTH
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="perforated-edge" style={{ marginTop: "4rem" }} />
    </section>
  );
}

