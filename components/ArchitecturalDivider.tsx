"use client";

export function ArchitecturalDivider({
  code,
  label,
}: {
  code: string;
  label: string;
}) {
  return (
    <div
      className="w-full border-y-[1.5px] border-ink bg-sand/60 py-2.5 px-4 flex items-center justify-between font-mono text-[11px] text-ink/60 uppercase tracking-[0.1em]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <span className="text-signal font-bold">+</span>
        <span className="font-bold text-ink">{code}</span>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-ink/40">
        <span>--- COHORT SPECIFICATION ARCHITECTURE ---</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-ink/80">{label}</span>
        <span className="text-signal font-bold">+</span>
      </div>
    </div>
  );
}
