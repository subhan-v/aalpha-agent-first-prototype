import Link from "next/link";
import { ArrowRight } from "lucide-react";

const JOURNEYS = [
  {
    href: "/giveloop",
    name: "Give Loop",
    who: "Amina, CelebrateMercy's team",
    idea: "Describe a text in plain words. Give Loop builds the audience and the draft, a second person approves, and results come back the next morning.",
    steps: 6,
    swatch: "#0F5F59",
  },
  {
    href: "/headroom",
    name: "Headroom",
    who: "Nadia, owner of Larkspur Agency",
    idea: "Agents do the repeat work. Headroom pings you in Slack when something needs you, asks for more trust once it's earned, and lets you undo anything.",
    steps: 7,
    swatch: "#1E5BB8",
  },
  {
    href: "/shadow",
    name: "Shadow Studio",
    who: "The Aalpha delivery team",
    idea: "See which clients trust their agents and which don't. Fix the rule behind an undo, and offer the next level when a client has earned it.",
    steps: 6,
    swatch: "#0E1626",
  },
  {
    href: "/ci",
    name: "Culture Intelligence",
    who: "Maya, owner of Harbor & Pine",
    idea: "Hiring happens in Slack. Sia posts results, compares finalists, books interviews, and only asks you about what a candidate will read.",
    steps: 8,
    swatch: "#2563EB",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh px-[max(16px,env(safe-area-inset-left))] py-12 md:py-20">
      <div className="mx-auto max-w-[1040px] grid gap-10 font-[family-name:var(--font-manrope)]">
        <header className="grid gap-3 max-w-[62ch]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5E6470]">Prototype · sample data</span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">Agent-first, one product at a time</h1>
          <p className="text-lg text-[#5E6470]">
            Each journey is clickable from start to finish. A guide on the right tells you where you are and what to click next.
          </p>
        </header>

        <ol className="grid sm:grid-cols-2 gap-4">
          {JOURNEYS.map((j) => (
            <li key={j.href}>
              <Link
                href={j.href}
                className="group h-full rounded-2xl border border-[#DADDE2] bg-white p-6 grid gap-4 content-start hover:border-[#16191F] focus-visible:outline-3 focus-visible:outline-[#9A6A1F] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ background: j.swatch }} aria-hidden />
                  <h2 className="text-xl font-semibold">{j.name}</h2>
                  <span className="ml-auto text-sm text-[#5E6470] tabular-nums">{j.steps} steps</span>
                </div>
                <p className="text-[15px] leading-relaxed text-[#3A3F4A]">{j.idea}</p>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#5E6470]">You play {j.who}</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    Start <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
