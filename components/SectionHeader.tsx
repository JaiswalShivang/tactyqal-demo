"use client";

import React from "react";

type HeadingProps = {
  children?: React.ReactNode;
  level?: "h1" | "h2" | "h3";
  title?: string;
  accent?: string;
  accentColor?: "signal" | "ink" | "white" | "volt";
  className?: string;
};

export function Heading({
  children,
  level = "h2",
  title,
  accent,
  accentColor = "signal",
  className = "",
}: HeadingProps) {
  const Tag = level;
  const baseClasses =
    level === "h1"
      ? "font-display font-extrabold text-[clamp(2.75rem,6.5vw,6rem)] tracking-[-0.035em] leading-[1.02]"
      : level === "h2"
        ? "font-display font-extrabold text-[clamp(2rem,4.2vw,3.75rem)] tracking-[-0.035em] leading-[1.02]"
        : "font-display font-bold text-2xl tracking-[-0.02em] leading-[1.1]";

  const accentColorClass =
    accentColor === "volt"
      ? "text-volt"
      : accentColor === "signal"
        ? "text-signal"
        : accentColor === "white"
          ? "text-white"
          : "text-ink";

  const rawText = title || (typeof children === "string" ? children : "");

  if (!accent || !rawText || !rawText.includes(accent)) {
    return (
      <Tag className={`${baseClasses} ${className}`}>
        {children || title}
      </Tag>
    );
  }

  const parts = rawText.split(accent);

  return (
    <Tag className={`${baseClasses} ${className}`}>
      {parts[0]}
      <span className={`font-display font-extrabold ${accentColorClass}`}>
        {accent}
      </span>
      {parts.slice(1).join(accent)}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  accentColor = "signal",
  description,
  action,
  className = "",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  accentColor?: "signal" | "ink" | "white" | "volt";
  description?: string;
  action?: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div
              className={`font-mono text-xs uppercase tracking-[0.08em] mb-3 ${
                dark ? "text-paper/50" : "text-ink/50"
              }`}
            >
              {eyebrow}
            </div>
          )}
          <Heading
            level="h2"
            title={title}
            accent={accent}
            accentColor={accentColor}
            className={dark ? "text-paper" : "text-ink"}
          />
          {description && (
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${
                dark ? "text-paper/70" : "text-ink/70"
              }`}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export default SectionHeader;
