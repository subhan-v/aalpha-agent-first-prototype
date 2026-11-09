"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Bug,
  CalendarCheck,
  Inbox,
  LayoutGrid,
  Mic,
  Rocket,
  TriangleAlert,
} from "lucide-react";
import { JourneyShell, type JourneyStep } from "@/components/proto/journey-shell";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PERSONA =
  "You're on the Aalpha team, running delivery for 10 agencies. Shadow Studio shows you where clients trust their agents and where they don't.";

const STEPS: JourneyStep[] = [
  {
    title: "Monday: which clients need you",
    note: "Studio sorts clients by trust, not by activity.",
    hint: "Open Halden Agency",
  },
  {
    title: "Halden's Trust tab",
    note: "One sentence tells you the state. The table shows which agents to move up and which to fix.",
    hint: "Click the Ad spend row",
  },
  {
    title: "Why the client undid it",
    note: "Three undos, all for the same reason. The fix belongs in the Playbook rule, not in the agent.",
    hint: "Click Update the rule",
  },
  {
    title: "Fixed. Now move one up",
    note: "The row now says it's being watched. The status updates agent has 18 clean runs.",
    hint: "Click Offer next level on Weekly client status updates",
  },
  {
    title: "Preview what the client sees",
    note: "The client gets one question, once, in their own app. Nothing changes until they say yes.",
    hint: "Click Send to Theo",
  },
  {
    title: "Waiting on the client",
    note: "Studio tracks the offer. If Theo says yes, the level changes on its own.",
  },
];

const NAV: { section: string; items: { label: string; icon: typeof LayoutGrid; count?: number; active?: boolean }[] }[] = [
  {
    section: "Work",
    items: [
      { label: "Clients", icon: LayoutGrid, count: 10, active: true },
      { label: "This week", icon: CalendarCheck, count: 40 },
      { label: "Onboarding", icon: Rocket, count: 15 },
      { label: "Interviews", icon: Mic },
    ],
  },
  {
    section: "Inbox",
    items: [
      { label: "Alerts", icon: Bell, count: 14 },
      { label: "Requests", icon: Inbox, count: 4 },
      { label: "Bugs", icon: Bug, count: 4 },
      { label: "Agent health", icon: Activity, count: 10 },
    ],
  },
];

const CLIENTS = [
  { name: "Halden Agency", day: 86, hours: "33.6", pill: { tone: "coral", label: "Trust drop" }, open: true },
  { name: "Larkspur Agency", day: 45, hours: "100.4", pill: { tone: "blue", label: "2 ready to move up" } },
  { name: "Northline", day: 22, hours: "18", pill: { tone: "mint", label: "Healthy" } },
  { name: "Brightpath", day: 61, hours: "41", pill: { tone: "mint", label: "Healthy" } },
] as const;

type Tone = "coral" | "blue" | "mint" | "bronze" | "grey";

const TONES: Record<Tone, string> = {
  coral: "bg-[var(--sh-coral-soft)] text-[var(--sh-coral)]",
  blue: "bg-[var(--sh-blue-soft)] text-[var(--sh-blue)]",
  mint: "bg-[var(--sh-mint-soft)] text-[var(--sh-mint)]",
  bronze: "bg-[var(--sh-bronze-soft)] text-[var(--sh-bronze)]",
  grey: "bg-[var(--sh-soft)] text-[var(--sh-muted)]",
};

function Pill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const LEVEL_TONE = { "Ask first": "grey", "Do and tell": "blue", "Just do it": "mint" } as const;

const UNDOS = [
  { who: "Nadia R.", when: "Oct 29 · 16:42", quote: "Budget was already approved for the weekend" },
  { who: "Theo G.", when: "Nov 2 · 09:15", quote: "Seasonal push, intended" },
  { who: "Nadia R.", when: "Nov 5 · 11:03", quote: "Client asked for this spend" },
];

const primaryBtn =
  "bg-[var(--sh-night)] text-white hover:bg-[var(--sh-night-2)] focus-visible:ring-[var(--sh-blue-2)]";
const softBtn =
  "border-[var(--sh-line)] bg-white text-[var(--sh-fg)] hover:bg-[var(--sh-soft)] focus-visible:ring-[var(--sh-blue-2)]";

function Sidebar() {
  return (
    <aside className="bg-[var(--sh-night)] text-[var(--sh-night-fg)] @3xl:w-56 @3xl:shrink-0 @3xl:p-3 p-2">
      <div className="flex items-center gap-2.5 px-2 py-1.5 @3xl:mb-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--sh-night-2)]">
          <span className="size-3 rounded-full bg-[var(--sh-blue-2)]" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-bold whitespace-nowrap">Shadow Studio</span>
          <span className="block text-xs text-[var(--sh-night-muted)] whitespace-nowrap">Aalpha only</span>
        </span>
      </div>
      <nav aria-label="Shadow Studio" className="flex gap-4 overflow-x-auto @3xl:grid @3xl:gap-4 @3xl:overflow-visible">
        {NAV.map((g) => (
          <div key={g.section} className="flex items-center gap-1 @3xl:grid @3xl:gap-0.5">
            <p className="hidden @3xl:block px-2 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--sh-night-muted)]">
              {g.section}
            </p>
            {g.items.map((it) => (
              <span
                key={it.label}
                aria-current={it.active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold whitespace-nowrap",
                  it.active ? "bg-[var(--sh-night-2)] text-white" : "text-[var(--sh-night-muted)]",
                )}
              >
                <it.icon className="size-4 shrink-0" aria-hidden />
                <span>{it.label}</span>
                {it.count != null && (
                  <span className="ml-auto rounded-full bg-white/10 px-1.5 text-[11px] tabular-nums @3xl:ml-auto">
                    {it.count}
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function ClientsScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Clients</h1>
        <p className="text-sm text-[var(--sh-muted)]">Sorted by trust, not by activity.</p>
      </div>
      <div className="rounded-[20px] border border-[var(--sh-line)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--sh-line)] text-[var(--sh-muted)]">
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-3 py-3 font-semibold">Progress</th>
                <th className="px-3 py-3 font-semibold">Hours back</th>
                <th className="px-3 py-3 font-semibold">Trust</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr
                  key={c.name}
                  className={cn("border-b border-[var(--sh-line)] last:border-0", "open" in c && "bg-[var(--sh-coral-soft)]/30")}
                >
                  <td className="px-5 py-3.5 font-bold">{c.name}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    Day {c.day} <span className="text-[var(--sh-muted)]">of 90</span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap tabular-nums">{c.hours} h</td>
                  <td className="px-3 py-3.5">
                    <Pill tone={c.pill.tone}>{c.pill.label}</Pill>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {"open" in c ? (
                      <Button size="sm" className={primaryBtn} onClick={onOpen}>
                        Open <ArrowRight />
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TABS = ["Overview", "Delivery", "Results", "Trust", "Settings"];

function summaryFor(step: number) {
  const base = "88% of agent work approved with no edits this month. ";
  if (step <= 2) return base + "2 agents are ready to move up and 1 needs fixing.";
  if (step <= 4) return base + "2 agents are ready to move up. The fix is in progress.";
  return base + "1 offer is out, waiting on Theo. 1 agent is ready to move up. The fix is in progress.";
}

function TrustScreen({
  step,
  onWhy,
  onOffer,
}: {
  step: number;
  onWhy: () => void;
  onOffer: () => void;
}) {
  const fixed = step >= 3;
  const offered = step >= 5;
  const canOffer = step === 3;

  const rows = [
    { name: "Weekly client status updates", level: "Ask first", pct: 100 },
    { name: "Monthly client reports", level: "Do and tell", pct: 96 },
    { name: "Ad spend and pacing checks", level: "Do and tell", pct: 81 },
    { name: "Meeting notes to tasks", level: "Just do it", pct: 93 },
  ] as const;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="rounded-[20px] border border-[var(--sh-line)] bg-white p-5">
        <p className="text-xs text-[var(--sh-muted)]">Clients / Halden Agency</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Halden Agency</h1>
          <Pill tone="coral">
            <TriangleAlert className="size-3" aria-hidden /> At risk
          </Pill>
          <Pill tone="blue">Day-90 review</Pill>
        </div>
        <p className="mt-1 text-sm text-[var(--sh-muted)]">Day 86 of 90 · 33.6 of 40 hours back</p>
      </div>

      <div role="tablist" aria-label="Client sections" className="flex gap-1 overflow-x-auto rounded-[20px] border border-[var(--sh-line)] bg-white p-1.5">
        {TABS.map((t) => (
          <span
            key={t}
            role="tab"
            aria-selected={t === "Trust"}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold",
              t === "Trust" ? "bg-[var(--sh-night)] text-white" : "text-[var(--sh-muted)]",
            )}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="rounded-[20px] border border-[var(--sh-line)] bg-white">
        <p className="min-w-0 px-5 pt-5 text-base font-bold leading-snug">{summaryFor(step)}</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-y border-[var(--sh-line)] text-[var(--sh-muted)]">
                <th className="px-5 py-3 font-semibold">Agent</th>
                <th className="px-3 py-3 font-semibold">Level</th>
                <th className="px-3 py-3 font-semibold">No edits</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isAd = r.name.startsWith("Ad spend");
                const isStatus = r.name.startsWith("Weekly");
                const isReports = r.name.startsWith("Monthly");
                return (
                  <tr
                    key={r.name}
                    className={cn(
                      "border-b border-[var(--sh-line)] last:border-0",
                      isAd && !fixed && "bg-[var(--sh-coral-soft)]/50",
                    )}
                  >
                    <td className="px-5 py-3.5 font-bold">{r.name}</td>
                    <td className="px-3 py-3.5">
                      <Pill tone={LEVEL_TONE[r.level]}>{r.level}</Pill>
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3.5 tabular-nums font-semibold",
                        isAd && "text-[var(--sh-coral)]",
                      )}
                    >
                      {r.pct}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {isAd &&
                        (fixed ? (
                          <Pill tone="mint">Rule updated · watching next 10 runs</Pill>
                        ) : (
                          <Button size="sm" variant="outline" className={softBtn} onClick={onWhy}>
                            Why?
                          </Button>
                        ))}
                      {isStatus &&
                        (offered ? (
                          <Pill tone="bronze">Offered Mon 10:14 · waiting on Theo</Pill>
                        ) : (
                          <Button
                            size="sm"
                            className={primaryBtn}
                            disabled={!canOffer}
                            onClick={onOffer}
                          >
                            Offer next level
                          </Button>
                        ))}
                      {isReports && (
                        <Button size="sm" className={primaryBtn} disabled>
                          Offer next level
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ShadowJourney() {
  const [step, setStep] = useState(0);
  // Sheet dismissal is local UI state that only applies to the step it was closed on.
  const [closedAt, setClosedAt] = useState<number | null>(null);

  const sheetKind = step === 2 ? "why" : step === 4 ? "preview" : null;
  const sheetOpen = sheetKind !== null && closedAt !== step;

  const go = (n: number) => {
    setClosedAt(null);
    setStep(n);
  };

  return (
    <JourneyShell product="Shadow Studio" persona={PERSONA} steps={STEPS} step={step} setStep={go}>
      <div className="p-sh flex min-h-[640px] flex-col overflow-hidden rounded-[20px] border border-[var(--sh-line)] bg-[var(--sh-cloud)] @3xl:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1 p-4 @3xl:p-6">
          {step === 0 ? (
            <ClientsScreen onOpen={() => go(1)} />
          ) : (
            <TrustScreen
              step={step}
              onWhy={() => (step === 2 ? setClosedAt(null) : go(2))}
              onOffer={() => (step === 4 ? setClosedAt(null) : go(4))}
            />
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={(o) => !o && setClosedAt(step)}>
        <SheetContent className="p-sh w-full overflow-y-auto bg-white data-[side=right]:sm:max-w-md data-[side=right]:lg:right-[352px] data-[side=right]:lg:inset-y-4 data-[side=right]:lg:h-auto lg:rounded-2xl lg:border">
          {sheetKind === "why" && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle className="text-lg font-extrabold">Ad spend and pacing checks</SheetTitle>
                <SheetDescription>Three undos in the last 30 days, all for the same reason.</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 px-4">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-2">
                  {UNDOS.map((u) => (
                    <li key={u.when} className="rounded-2xl border border-[var(--sh-line)] p-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="text-sm font-bold">{u.who}</span>
                        <span className="mono text-xs text-[var(--sh-muted)]">{u.when}</span>
                      </div>
                      <p className="mt-1 min-w-0 text-sm">&ldquo;{u.quote}&rdquo;</p>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--sh-muted)]">Current rule</p>
                  <p className="mt-1 text-sm">Lower spend when a campaign is more than 25% ahead of pace.</p>
                </div>
                <div className="rounded-2xl bg-[var(--sh-blue-soft)] p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--sh-blue)]">Suggested change</p>
                  <p className="mt-1 text-sm font-semibold">Skip campaigns tagged &lsquo;approved push&rsquo; in the CRM.</p>
                </div>
              </div>
              <SheetFooter>
                <Button className={cn(primaryBtn, "h-10")} onClick={() => go(3)}>
                  Update the rule
                </Button>
              </SheetFooter>
            </>
          )}
          {sheetKind === "preview" && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle className="text-lg font-extrabold">What Theo will see</SheetTitle>
                <SheetDescription>Theo Grant, owner, will see this in Headroom.</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <div className="overflow-hidden rounded-2xl border border-[var(--sh-line)] bg-white">
                  <div className="bg-[var(--sh-blue-soft)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--sh-blue)]">
                    Headroom
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)] gap-4 p-4">
                    <p className="min-w-0 text-base font-semibold leading-snug">
                      You&apos;ve approved 18 status updates without a single edit. Let the agent post them on its own and tell you after?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button disabled className="bg-[var(--sh-blue)] text-white">
                        Yes, let it post
                      </Button>
                      <Button disabled variant="outline" className={softBtn}>
                        Keep asking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button className={cn(primaryBtn, "h-10")} onClick={() => go(5)}>
                  Send to Theo
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </JourneyShell>
  );
}
