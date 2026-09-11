import { motion } from "motion/react";
import { ESCALATION } from "@/lib/kps-data";

export function EscalationMeter({ level }: { level: number }) {
  const pct = ((level + 1) / ESCALATION.length) * 100;
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Problem escalation
        </span>
        <span className="text-sm font-semibold text-accent">{ESCALATION[level]}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundImage: "var(--gradient-primary)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
      <div className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:flex">
        {ESCALATION.map((s, i) => (
          <span key={s} className={i <= level ? "text-foreground/80" : ""}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
