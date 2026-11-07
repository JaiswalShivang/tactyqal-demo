"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId: number;

    const move = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
    };

    const checkOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [tabindex]"
      );
      setIsOver(!!interactive);
    };

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mousemove", checkOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousemove", checkOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isOver ? "over-interactive" : ""}`}
      aria-hidden="true"
    />
  );
}

