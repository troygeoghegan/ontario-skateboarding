import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "default" | "muted";
};

export function SectionLabel({ children, tone = "default" }: SectionLabelProps) {
  return (
    <p
      className={`font-display text-xs font-bold uppercase tracking-[0.35em] ${
        tone === "muted" ? "text-zinc-500" : "text-hazard"
      }`}
    >
      {children}
    </p>
  );
}
