"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TOOLS_DATA, type ToolData } from "@/lib/tools-data";
import { SectionHeader } from "@/components/SectionHeader";

function ToolIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    lightbulb: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M9 15 Q9 18 12 18 Q15 18 15 15" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 18 L12 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="3" y="12" width="4" height="9" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="7" width="4" height="14" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="3" width="4" height="18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M2 20 Q2 15 8 15 Q14 15 14 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 15 Q22 15 22 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    presentation: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 16 L12 20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 20 L16 20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8 L10 11 L14 7 L17 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 17 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    handshake: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M4 12 L10 8 L14 10 L20 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M4 12 L10 16 L14 14 L20 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    puzzle: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M4 4 L10 4 Q10 2 12 2 Q14 2 14 4 L20 4 L20 10 Q22 10 22 12 Q22 14 20 14 L20 20 L14 20 Q14 22 12 22 Q10 22 10 20 L4 20 L4 14 Q2 14 2 12 Q2 10 4 10 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    monitor: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 21 L16 21 M12 17 L12 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  };

  return <span className="text-current">{icons[type] ?? icons["lightbulb"]}</span>;
}

function QuizModal({ tool, onClose }: { tool: ToolData; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleSelect = (optionIndex: number) => {
    const question = tool.questions[step];
    const score = question?.scores[optionIndex] ?? 25;
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);
    if (step + 1 < tool.questions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const totalScore = answers.reduce((acc, v) => acc + v, 0);
  const maxScore = tool.questions.reduce((acc, q) => {
    const max = Math.max(...q.scores);
    return acc + max;
  }, 0);
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 75;
  const verdict = tool.resultVerdict(totalScore);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${tool.name} assessment modal`}
    >
      <motion.div
        className="bg-white border-2 border-[#0F1B3D] w-full max-w-2xl p-6 sm:p-8 relative shadow-[8px_8px_0px_#FF3D88] text-[#0F1B3D] max-h-[90vh] overflow-y-auto"
        initial={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border border-[#0F1B3D] bg-white text-[#0F1B3D] hover:bg-[#FF3D88] hover:text-white flex items-center justify-center transition-colors font-mono font-bold cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 border border-ink bg-ivory flex items-center justify-center text-signal">
            <ToolIcon type={tool.icon} />
          </div>
          <div>
            <div className="font-display font-bold text-xl tracking-tight leading-snug">
              {tool.name}
            </div>
            <div className="font-mono text-xs text-ink/50 uppercase tracking-wider">
              DIAGNOSTIC TEST
            </div>
          </div>
        </div>

        <div>
          {!done ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4 font-mono text-xs text-ink/50">
                  <span>
                    QUESTION {step + 1} OF {tool.questions.length}
                  </span>
                  <div className="flex gap-1">
                    {tool.questions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-1 border border-ink ${
                          i < step
                            ? "bg-signal"
                            : i === step
                            ? "bg-ink"
                            : "bg-sand"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-base font-medium mb-6 leading-relaxed">
                  {tool.questions[step]?.question}
                </p>

                <div className="space-y-2.5">
                  {tool.questions[step]?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className="w-full text-left p-3.5 border border-ink bg-ivory hover:bg-sand text-sm font-medium transition-colors flex items-center gap-3 text-ink shadow-tactile-sm hover:translate-x-0.5 cursor-pointer"
                    >
                      <span className="font-mono text-xs text-ink/40 w-5 flex-shrink-0">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-ink/50 mb-3 stamp-text">
                  {tool.resultLabel.toUpperCase()}
                </div>

                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#F4F6FB"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#FF3D88"
                      strokeWidth="3"
                      strokeDasharray={`${pct} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-display text-3xl font-extrabold text-ink">{pct}</div>
                    <div className="font-mono text-xs text-ink/50">/100</div>
                  </div>
                </div>

                <div className="bg-sand border border-ink px-4 py-1.5 font-mono text-xs font-bold mb-4 inline-block tracking-wider">
                  {tool.resultLabel}: {pct}/100
                </div>
              </div>

              <p className="text-sm text-ink/80 leading-relaxed mb-6 border-l-4 border-signal pl-4">
                {verdict}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setAnswers([]); setStep(0); setDone(false); }}
                  className="tactile-btn flex-1 py-2.5 text-xs font-semibold text-center bg-ivory font-mono uppercase tracking-wider"
                >
                  Retake Test
                </button>
                <a
                  href="#pricing"
                  onClick={onClose}
                  className="tactile-btn-signal flex-1 py-2.5 text-xs font-semibold text-center font-mono uppercase tracking-wider"
                >
                  Book Free Call
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function FreeToolsSection() {
  const [activeTool, setActiveTool] = useState<ToolData | null>(null);
  const prefersReduced = useReducedMotion();
  const closeQuiz = useCallback(() => setActiveTool(null), []);

  return (
    <section
      id="free-tools"
      className="py-16 md:py-22 px-4 bg-[#0F1B3D] text-[#FFFFFF] free-tools-dots border-y border-[#263B73] relative overflow-hidden perforated-tear-top perforated-tear-bottom"
      aria-label="Free startup diagnostic tools"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-luminosity pointer-events-none"
        src="https://www.tactyqal.com/application/assets/videos/continuous-support.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B3D] via-[#0F1B3D]/85 to-[#0F1B3D] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-20">
        <SectionHeader
          eyebrow="05 / 09 · FREE RESOURCES"
          title="Used by 1,000+ Entrepreneurs"
          accent="1,000+"
          accentColor="volt"
          description="Free diagnostic tools to validate your startup idea, team, and go-to-market execution. Each takes under 3 minutes."
          dark={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS_DATA.map((tool, i) => (
            <motion.button
              key={tool.id}
              className="text-left p-6 bg-[#162654] border-[1.5px] border-[#263B73] hover:border-[#FF3D88] transition-all group flex flex-col justify-between cursor-pointer"
              style={{
                boxShadow: "0 0 0 transparent",
              }}
              whileHover={
                prefersReduced
                  ? {}
                  : {
                      transform: "translate(-2px, -2px)",
                      boxShadow: "4px 4px 0 #FF3D88",
                    }
              }
              initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActiveTool(tool)}
              aria-label={`Launch ${tool.name} diagnostic tool`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 border border-[#263B73] bg-[#0F1B3D] flex items-center justify-center text-paper/80 group-hover:text-signal group-hover:border-signal transition-colors">
                    <ToolIcon type={tool.icon} />
                  </div>
                  <span className="font-mono text-xs text-paper/40 group-hover:text-signal transition-colors font-bold">
                    № 0{i + 1}
                  </span>
                </div>

                <div className="font-display font-bold text-lg text-paper mb-1.5 leading-snug tracking-tight">
                  {tool.name}
                </div>
                <div className="text-xs text-paper/65 mb-6 leading-relaxed">
                  {tool.tagline}
                </div>
              </div>

              <div className="pt-3 border-t border-[#263B73] flex items-center justify-between font-mono text-xs text-signal">
                <span className="tracking-wider uppercase font-semibold">LAUNCH TEST</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTool && <QuizModal tool={activeTool} onClose={closeQuiz} />}
      </AnimatePresence>
    </section>
  );
}
