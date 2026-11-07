"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TOOLS_DATA, type ToolData } from "@/lib/tools-data";

function ToolIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    lightbulb: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M9 15 Q9 18 12 18 Q15 18 15 15" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 18 L12 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="12" width="4" height="9" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="7" width="4" height="14" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="3" width="4" height="18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M2 20 Q2 15 8 15 Q14 15 14 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 15 Q22 15 22 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    presentation: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 16 L12 20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 20 L16 20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8 L10 11 L14 7 L17 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 17 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    handshake: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M4 12 L10 8 L14 10 L20 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M4 12 L10 16 L14 14 L20 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    puzzle: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M4 4 L10 4 Q10 2 12 2 Q14 2 14 4 L20 4 L20 10 Q22 10 22 12 Q22 14 20 14 L20 20 L14 20 Q14 22 12 22 Q10 22 10 20 L4 20 L4 14 Q2 14 2 12 Q2 10 4 10 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    monitor: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 21 L16 21 M12 17 L12 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  };

  return (
    <span className="text-current">{icons[type] ?? icons["lightbulb"]}</span>
  );
}

function QuizModal({
  tool,
  onClose,
}: {
  tool: ToolData;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const totalScore = answers.reduce((sum, a, i) => {
    const q = tool.questions[i];
    return sum + (q ? (q.scores[a] ?? 0) : 0);
  }, 0);

  const maxScore = tool.questions.reduce(
    (sum, q) => sum + Math.max(...q.scores),
    0
  );

  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const verdict = tool.resultVerdict(totalScore);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (newAnswers.length >= tool.questions.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const currentQ = tool.questions[step];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${tool.name} quick assessment`}
    >
      <motion.div
        className="bg-paper border border-ink w-full max-w-lg relative"
        initial={prefersReduced ? {} : { y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={prefersReduced ? {} : { y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-ink text-white p-5 flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-white/40 mb-1 stamp-text">
              QUICK TEST · {tool.name.toUpperCase()}
            </div>
            <div className="font-boomdang text-xl font-bold">{tool.tagline}</div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close quiz"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {!done ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={prefersReduced ? {} : { x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={prefersReduced ? {} : { x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-mono text-xs text-ink/40 mb-4">
                  QUESTION {step + 1} OF {tool.questions.length}
                </div>

                <div className="w-full h-1 bg-sand mb-6">
                  <div
                    className="h-full bg-signal transition-all"
                    style={{ width: `${((step) / tool.questions.length) * 100}%` }}
                  />
                </div>

                <p className="font-semibold text-base mb-5 leading-snug">
                  {currentQ?.question}
                </p>

                <div className="flex flex-col gap-2">
                  {currentQ?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="text-left p-3 border border-ink/30 hover:border-ink hover:bg-volt transition-all text-sm"
                    >
                      <span className="font-mono text-xs text-ink/40 mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
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
                <div className="font-mono text-xs text-ink/40 mb-3 stamp-text">
                  {tool.resultLabel.toUpperCase()}
                </div>

                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#EAE6DF"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#FF4F18"
                      strokeWidth="3"
                      strokeDasharray={`${pct} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-boomdang text-3xl font-bold">{pct}</div>
                    <div className="font-mono text-xs text-ink/50">/100</div>
                  </div>
                </div>

                <div className="bg-volt border border-ink px-4 py-2 font-mono text-sm font-bold mb-4 inline-block rotate-1">
                  {tool.resultLabel}: {pct}/100
                </div>
              </div>

              <p className="text-sm text-ink/70 leading-relaxed mb-6 border-l-4 border-signal pl-4">
                {verdict}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setAnswers([]); setStep(0); setDone(false); }}
                  className="tactile-btn flex-1 py-2 text-sm font-semibold text-center bg-ivory"
                >
                  Retake
                </button>
                <a
                  href="#pricing"
                  onClick={onClose}
                  className="tactile-btn-signal flex-1 py-2 text-sm font-semibold text-center"
                >
                  Book Consultation
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
      className="py-24 px-4 bg-volt border-y border-ink"
      aria-label="Free tools"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="section-number mb-3">№ 05 / 08 · FREE RESOURCES</div>
          <h2 className="headline-display mb-4">
            Used by{" "}
            <span className="bg-ink text-volt px-2">1,000+</span>{" "}
            Entrepreneurs
          </h2>
          <p className="text-ink/70 max-w-xl">
            Free diagnostic tools to validate your startup idea, team, and strategy. Each takes under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOLS_DATA.map((tool, i) => (
            <motion.button
              key={tool.id}
              className="text-left p-5 bg-ivory border border-ink hover:shadow-tactile transition-all group"
              initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveTool(tool)}
              aria-label={`Launch ${tool.name} tool`}
            >
              <div className="mb-3 text-ink group-hover:text-signal transition-colors">
                <ToolIcon type={tool.icon} />
              </div>
              <div className="font-boomdang font-bold text-base mb-1 leading-tight">
                {tool.name}
              </div>
              <div className="text-xs text-ink/60 mb-3">{tool.tagline}</div>
              <div className="font-mono text-xs text-signal group-hover:translate-x-1 transition-transform inline-block stamp-text">
                LAUNCH TEST →
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

