"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function TicketIntro({ onDone }: { onDone: () => void }) {
  const prefersReduced = useReducedMotion();
  const [stamped, setStamped] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      onDone();
      return;
    }

    const stampTimer = setTimeout(() => setStamped(true), 700);
    const doneTimer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 1800);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone, prefersReduced]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className="ticket-card w-80 p-8 text-center"
          initial={{ y: -120, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="ticket-notch ticket-notch-left" />
          <div className="ticket-notch ticket-notch-right" />

          <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">
            TACTYQAL LABS · ADMISSION TICKET
          </div>

          <div className="font-boomdang text-3xl font-bold mb-4 leading-none">
            THE BUILDER&apos;S
            <br />
            TICKET
          </div>

          <div className="border-t border-dashed border-ink/30 my-4" />

          <div className="font-mono text-xs text-ink/50 mb-6 stamp-text">
            8-WEEK COHORT · LIMITED SEATS
          </div>

          <motion.div
            className="absolute -top-4 -right-4 bg-signal text-white font-mono text-sm font-bold px-4 py-2 rotate-12 border border-ink shadow-tactile"
            initial={{ scale: 1.3, opacity: 0, rotate: 15 }}
            animate={
              stamped
                ? { scale: 1, opacity: 1, rotate: 12 }
                : { scale: 1.3, opacity: 0, rotate: 15 }
            }
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
          >
            COHORT OPEN
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: stamped ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className="font-mono text-xs text-ink/40 stamp-text hover:text-ink/70 transition-colors"
            onClick={() => {
              if (!doneRef.current) {
                doneRef.current = true;
                onDone();
              }
            }}
          >
            SKIP INTRO ↓
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

