import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  Flame,
  Languages,
  PhoneCall,
  Sparkles,
  Undo2,
  UserRound,
  Cpu,
  CupSoda,
} from "lucide-react";

import {
  AMMACHI,
  ESCALATION,
  EXPERT,
  LOADING_STEPS,
  MICRO_JOKES,
  REACTIONS,
  REGRET,
  SOLUTIONS,
  TRANSLATIONS,
  WORSE,
  pickDifferent,
} from "@/lib/kps-data";
import { playBlip, playReaction } from "@/lib/kps-audio";
import { AudioControls } from "@/components/kps/Controls";
import { EscalationMeter } from "@/components/kps/Escalation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kerala Problem Solver 3000 — Nobody Solves Anything" },
      {
        name: "description",
        content:
          "A fake futuristic AI that turns any problem into a gloriously useless Malayali solution. Chaaya included. Results guaranteed to be zero.",
      },
      { property: "og:title", content: "Kerala Problem Solver 3000" },
      {
        property: "og:description",
        content: "Your problem. Our problem. Nobody solves anything.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Card = { kind: string; text: string; sub?: string };

function Index() {
  const [problem, setProblem] = useState("");
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [worsened, setWorsened] = useState(0);
  const [level, setLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const prev = useRef<Record<string, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);

  const joke = useMemo(() => MICRO_JOKES[count % MICRO_JOKES.length], [count]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kps3000");
      if (raw) {
        const s = JSON.parse(raw);
        setCount(s.count ?? 0);
        setWorsened(s.worsened ?? 0);
        setLevel(s.level ?? 0);
        setMuted(s.muted ?? false);
        setVolume(s.volume ?? 0.6);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "kps3000",
        JSON.stringify({ count, worsened, level, muted, volume }),
      );
    } catch {
      /* ignore */
    }
  }, [count, worsened, level, muted, volume]);

  function fireReaction() {
    const r = pickDifferent(REACTIONS, prev.current['reaction']);
    prev.current['reaction'] = r;
    setReaction(r);
    playReaction(r, volume, muted);
    setTimeout(() => setReaction(null), 2600);
  }

  function push(kind: string, list: readonly string[], escalate = 1) {
    const text = pickDifferent(list, prev.current[kind]);
    prev.current[kind] = text;
    setCards((c) => [{ kind, text }, ...c].slice(0, 8));
    setLevel((l) => Math.min(ESCALATION.length - 1, l + escalate));
    playBlip(volume, muted);
    fireReaction();
  }

  function translate() {
    const t = TRANSLATIONS[Math.floor(Math.random() * TRANSLATIONS.length)]!;
    prev.current['translation'] = t[0];
    setCards((c) =>
      [
        {
          kind: "MALAYALI TRANSLATION",
          text: `"${t[0]}" → "${t[1]}"`,
          sub: t[2],
        },
        ...c,
      ].slice(0, 8),
    );
    setLevel((l) => Math.min(ESCALATION.length - 1, l + 1));
    playBlip(volume, muted);
    fireReaction();
  }

  function solve() {
    if (loadingStep !== null) return;
    setCards([]);
    setLoadingStep(0);
    playBlip(volume, muted);
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      if (i >= LOADING_STEPS.length) {
        clearInterval(tick);
        setLoadingStep(null);
        setCount((c) => c + 1);
        push("SOLUTION", SOLUTIONS, 1);
        setTimeout(
          () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
          150,
        );
      } else {
        setLoadingStep(i);
      }
    }, 620);
  }

  const showStats = count >= 5;

  return (
    <main className="grid-lines min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-5 pt-8 pb-24">
        {/* Top bar */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="glass-panel grid h-11 w-11 shrink-0 place-items-center">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">KPS·3000</p>
              <p className="truncate text-xs text-muted-foreground">{joke}</p>
            </div>
          </div>
          <AudioControls
            muted={muted}
            volume={volume}
            onToggle={() => setMuted((m) => !m)}
            onVolume={setVolume}
          />
        </header>

        {/* Hero */}
        <section className="pt-16 text-center sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel mx-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs tracking-[0.2em] uppercase"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Neural Chaaya Engine v3000
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-gradient mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            KERALA PROBLEM
            <br />
            SOLVER 3000
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            "Your problem. Our problem. Nobody solves anything."
          </motion.p>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel mx-auto mt-10 max-w-2xl p-3 sm:p-4"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={3}
              placeholder="Tell us your problem…"
              className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
            />
            <div className="flex flex-col gap-3 px-1 pb-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-left text-xs text-muted-foreground">
                Your data is not stored. Your problem is not read. Nothing happens, really.
              </p>
              <button
                onClick={solve}
                disabled={loadingStep !== null}
                className="text-primary-foreground shrink-0 rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                {loadingStep !== null ? "PROCESSING…" : "SOLVE MY PROBLEM"}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Loading */}
        <AnimatePresence>
          {loadingStep !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-panel mx-auto mt-8 max-w-2xl p-6"
            >
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 animate-pulse text-primary" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-sm sm:text-base"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                  animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {cards.length > 0 && loadingStep === null && (
          <section ref={resultRef} className="mt-10 space-y-4">
            <AnimatePresence initial={false}>
              {cards.map((c, i) => (
                <motion.article
                  key={`${c.kind}-${c.text}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                  className="glass-panel p-6"
                >
                  <p className="text-xs tracking-[0.25em] text-primary uppercase">{c.kind}</p>
                  <p className="mt-3 text-lg leading-relaxed sm:text-xl">{c.text}</p>
                  {c.sub && <p className="mt-2 text-sm text-accent">{c.sub}</p>}
                </motion.article>
              ))}
            </AnimatePresence>

            <EscalationMeter level={level} />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <ChaosButton
                icon={<Flame className="h-4 w-4" />}
                label="MAKE IT WORSE"
                onClick={() => {
                  setWorsened((w) => w + 1);
                  push("SITUATION UPDATE", WORSE, 2);
                }}
              />
              <ChaosButton
                icon={<UserRound className="h-4 w-4" />}
                label="ASK AMMACHI"
                onClick={() => push("AMMACHI PROTOCOL", AMMACHI, 2)}
              />
              <ChaosButton
                icon={<Languages className="h-4 w-4" />}
                label="MALAYALI TRANSLATION"
                onClick={translate}
              />
              <ChaosButton
                icon={<PhoneCall className="h-4 w-4" />}
                label="CALL AN EXPERT"
                onClick={() => push("EXPERT OPINION", EXPERT, 1)}
              />
              <ChaosButton
                icon={<Undo2 className="h-4 w-4" />}
                label="I REGRET ASKING"
                onClick={() => push("REGRET LOGGED", REGRET, 1)}
              />
            </div>
          </section>
        )}

        {/* Stats */}
        {showStats && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mt-10 p-6"
          >
            <div className="flex items-center gap-2">
              <CupSoda className="h-4 w-4 text-accent" />
              <h2 className="text-xs tracking-[0.25em] uppercase">Session diagnostics</h2>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Problems submitted" value={String(count)} />
              <Stat label="Problems solved" value="0" />
              <Stat label="Problems worsened" value={String(worsened || Math.floor(count * 1.7))} />
              <Stat label="Common sense detected" value="0%" />
              <Stat label="Tea recommended" value="∞" />
              <Stat label="Status" value="CERTIFIED MALAYALI PROBLEM" />
            </dl>
          </motion.section>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Kerala Problem Solver 3000 · No APIs, no backend, no solutions. Chaaya sold separately.
        </footer>
      </div>

      {/* Reaction toast */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-panel fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 text-center"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <p className="text-base font-semibold whitespace-nowrap">{reaction}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ChaosButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass-panel flex flex-col items-center gap-2 px-3 py-4 text-[11px] font-semibold tracking-wider transition-all hover:scale-[1.03] hover:border-primary/50 hover:text-primary active:scale-95"
    >
      {icon}
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}
