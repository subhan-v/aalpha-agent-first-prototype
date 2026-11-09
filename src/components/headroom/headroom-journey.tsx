"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  Check,
  ChevronDown,
  LayoutGrid,
  ListChecks,
  Settings,
  Users,
  Inbox,
} from "lucide-react";
import { JourneyShell, type JourneyStep } from "@/components/proto/journey-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PERSONA =
  "You're Nadia Reyes, owner of Larkspur Agency, 31 people. Agents handle your team's repeat work; you approve what matters.";

const STEPS: JourneyStep[] = [
  {
    title: "Monday 8:02 AM: a Slack DM",
    note: "Headroom doesn't wait for you to log in. It tells you in Slack when something needs you.",
    hint: "Click Open Headroom",
  },
  {
    title: "Needs you",
    note: "Two items wait for you. Everything else already happened.",
    hint: "Open 'How it was made', then click Post it",
  },
  {
    title: "Posted. One left",
    note: "The update went to the client channel. You can still undo it.",
    hint: "Click Review on the invoices",
  },
  {
    title: "Check the reminders",
    note: "The agent drafted 4 reminders and left one client out on purpose.",
    hint: "Click Send 4 reminders",
  },
  {
    title: "Headroom asks for more trust",
    note: "After enough clean approvals, it asks once, in the moment, instead of making you manage settings.",
    hint: "Click Yes, let it post",
  },
  {
    title: "The next Monday",
    note: "Nothing needs you. You see what happened, with a way to undo.",
    hint: "Click Undo on the Brightwater update",
  },
  {
    title: "Undo, and say why",
    note: "One tap undoes it. Your reason teaches the agent and goes to the Aalpha team.",
    hint: "Pick a reason",
  },
];

const darkBtn =
  "h-9 rounded-xl bg-[var(--sh-fg)] px-4 text-sm font-medium text-white hover:bg-[#2A3140]";
const lightBtn =
  "h-9 rounded-xl border-[var(--sh-line)] bg-[var(--sh-paper)] px-4 text-sm font-medium text-[var(--sh-fg)] hover:bg-[var(--sh-soft)]";

export function HeadroomJourney() {
  const [step, setStep] = useState(0);
  return (
    <JourneyShell product="Headroom" persona={PERSONA} steps={STEPS} step={step} setStep={setStep}>
      {step === 0 ? (
        <SlackDm onOpen={() => setStep(1)} />
      ) : (
        <AppFrame key={step} step={step} setStep={setStep} />
      )}
    </JourneyShell>
  );
}

/* ---------- Slack ---------- */

function SlackDm({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#D9D3DA] bg-white shadow-sm"
      style={{ fontFamily: 'ui-sans-serif, -apple-system, "Segoe UI", system-ui, sans-serif', color: "#1D1C1D" }}
    >
      <div className="flex items-center gap-3 bg-[#3F0E40] px-4 py-2.5 text-white">
        <span className="text-sm font-bold">Larkspur Agency</span>
        <span className="text-xs text-white/70">Direct messages</span>
      </div>
      <div className="border-b border-[#E8E5E8] px-4 py-2.5">
        <p className="text-[15px] font-bold">Headroom</p>
        <p className="text-xs text-[#616061]">App</p>
      </div>
      <div className="min-h-[360px] px-4 py-6">
        <p className="mb-4 text-center text-xs text-[#616061]">Monday</p>
        <div className="flex gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#0E1626]">
            <span className="size-3.5 rounded-full bg-[#4F86DD]" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px]">
              <span className="font-bold">Headroom</span>{" "}
              <span className="rounded bg-[#E8E5E8] px-1 text-[10px] font-semibold text-[#616061]">APP</span>{" "}
              <span className="text-xs text-[#616061]">8:02 AM</span>
            </p>
            <p className="mt-1 text-[15px] leading-relaxed">
              Morning Nadia. Your agents saved 22 hours last week. 2 things need you.
            </p>
            <Button
              onClick={onOpen}
              className="mt-3 h-9 rounded-md bg-[#007A5A] px-4 text-sm font-bold text-white hover:bg-[#006A4E]"
            >
              Open Headroom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- App frame ---------- */

function needsCount(step: number) {
  if (step === 1) return 2;
  if (step === 2 || step === 3 || step === 4) return 1;
  return 0;
}

const NAV = [
  { label: "Needs you", icon: Inbox },
  { label: "Overview", icon: LayoutGrid },
  { label: "Results", icon: ListChecks },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

function AppFrame({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const count = needsCount(step);
  return (
    <div className="p-sh flex min-h-[640px] flex-col overflow-hidden rounded-[20px] border border-[var(--sh-line)] bg-[var(--sh-cloud)] @3xl:flex-row">
      <aside className="shrink-0 border-b border-[var(--sh-line)] bg-[var(--sh-paper)] @3xl:w-56 @3xl:border-b-0 @3xl:border-r">
        <div className="flex items-center gap-3 px-4 pt-4 @3xl:pb-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--sh-night)]">
            <span className="size-3 rounded-full bg-[var(--sh-blue-2)]" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold">Headroom</p>
            <p className="text-xs text-[var(--sh-muted)]">Larkspur Agency</p>
          </div>
        </div>
        <nav aria-label="Headroom sections" className="flex gap-1 overflow-x-auto p-3 @3xl:flex-col @3xl:overflow-visible">
          {NAV.map((n, i) => {
            const Icon = n.icon;
            const active = i === 0;
            return (
              <div
                key={n.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm",
                  active ? "bg-[var(--sh-soft)] font-semibold" : "text-[var(--sh-muted)] font-medium",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{n.label}</span>
                {i === 0 && count > 0 && (
                  <span
                    aria-label={`${count} waiting`}
                    className="ml-auto rounded-full bg-[var(--sh-coral)] px-1.5 text-[11px] font-semibold leading-5 text-white"
                  >
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 p-4 @lg:p-6">
        {step === 4 ? (
          <Trust setStep={setStep} />
        ) : step >= 5 ? (
          <NextMonday step={step} setStep={setStep} />
        ) : (
          <NeedsYou step={step} setStep={setStep} />
        )}
      </section>
    </div>
  );
}

function Item({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("rounded-[20px] border border-[var(--sh-line)] bg-[var(--sh-paper)] p-4 @lg:p-5", className)}
    >
      {children}
    </motion.div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-5">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-[var(--sh-muted)]">{sub}</p>
    </header>
  );
}

/* ---------- Steps 1 to 3 ---------- */

function NeedsYou({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [fold, setFold] = useState(false);
  const posted = step >= 2;
  const reviewing = step === 3;
  return (
    <div>
      <Heading title="Needs you" sub="Your agents saved 22 hours last week." />
      <div className="grid gap-3">
        {posted ? (
          <Item className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 @lg:py-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--sh-mint-soft)] text-[var(--sh-mint)]">
              <Check className="size-3.5" aria-hidden />
            </span>
            <p className="min-w-0 flex-1 text-sm">
              Posted to <span className="mono text-[13px]">#brightwater-client</span> · 8:04 AM
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded text-sm font-medium text-[var(--sh-blue)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sh-blue)]"
            >
              Undo
            </button>
          </Item>
        ) : (
          <Item>
            <div className="flex flex-wrap items-start gap-2">
              <h3 className="min-w-0 flex-1 text-base font-semibold">
                Weekly update for Brightwater Dental is ready
              </h3>
              <Chip tone="blue">Draft</Chip>
            </div>
            <p className="mt-1 text-sm text-[var(--sh-muted)]">Leads up 18%, cost per lead down $6.</p>
            <button
              type="button"
              onClick={() => setFold((f) => !f)}
              aria-expanded={fold}
              className="mt-3 inline-flex items-center gap-1 rounded text-sm font-medium text-[var(--sh-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sh-blue)]"
            >
              How it was made
              <ChevronDown className={cn("size-4 transition-transform", fold && "rotate-180")} aria-hidden />
            </button>
            {fold && (
              <ul className="mt-2 grid gap-1 rounded-xl bg-[var(--sh-soft)] p-3 text-sm text-[var(--sh-muted)]">
                <li>Numbers from GHL › Brightwater</li>
                <li>Compared to last week</li>
                <li>
                  Written in your usual format for <span className="mono text-[13px]">#brightwater-client</span>
                </li>
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className={darkBtn} onClick={() => setStep(2)}>
                Post it
              </Button>
              <Button variant="outline" className={lightBtn}>
                Edit
              </Button>
            </div>
          </Item>
        )}

        {reviewing ? (
          <Reminders setStep={setStep} />
        ) : (
          <Item>
            <div className="flex flex-wrap items-start gap-2">
              <h3 className="min-w-0 flex-1 text-base font-semibold">4 invoice reminders, $8,420 overdue</h3>
              <Chip tone="coral">Overdue</Chip>
            </div>
            <p className="mt-1 text-sm text-[var(--sh-muted)]">
              Coastline Realty left out: they&apos;re on a payment plan.
            </p>
            <div className="mt-4">
              <Button className={darkBtn} onClick={() => setStep(3)}>
                Review
              </Button>
            </div>
          </Item>
        )}
      </div>
    </div>
  );
}

const REMINDERS = [
  { name: "Northpoint Legal", amount: "$3,200", days: 34, line: "Hi, a quick note that invoice 1042 is 34 days past due." },
  { name: "Brightwater Dental", amount: "$2,150", days: 21, line: "Hi, a friendly nudge on invoice 1051, now 21 days overdue." },
  { name: "Oakline Homes", amount: "$1,870", days: 18, line: "Hi, checking in on invoice 1056, which is 18 days overdue." },
  { name: "Fern & Co", amount: "$1,200", days: 15, line: "Hi, just a reminder that invoice 1060 is 15 days overdue." },
];

function Reminders({ setStep }: { setStep: (n: number) => void }) {
  const [checked, setChecked] = useState<boolean[]>([true, true, true, true]);
  const n = checked.filter(Boolean).length;
  return (
    <Item>
      <div className="flex flex-wrap items-start gap-2">
        <h3 className="min-w-0 flex-1 text-base font-semibold">4 invoice reminders, $8,420 overdue</h3>
        <Chip tone="coral">Overdue</Chip>
      </div>
      <ul className="mt-3 divide-y divide-[var(--sh-line)]">
        {REMINDERS.map((r, i) => (
          <li key={r.name} className="py-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                className="mt-1 size-4 shrink-0 accent-[var(--sh-fg)]"
                aria-label={`Send reminder to ${r.name}`}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <span className="mono text-[13px] text-[var(--sh-muted)]">
                    {r.amount} · {r.days} days
                  </span>
                </span>
                <span className="mt-0.5 block text-sm text-[var(--sh-muted)]">{r.line}</span>
              </span>
            </label>
          </li>
        ))}
        <li className="py-3 text-sm text-[var(--sh-muted)]">
          <span className="font-medium">Coastline Realty</span>{" "}
          <span className="mono text-[13px]">$4,600</span> · skipped, payment plan (from your Playbook)
        </li>
      </ul>
      <div className="mt-2">
        <Button className={darkBtn} disabled={n === 0} onClick={() => setStep(4)}>
          Send {n} {n === 1 ? "reminder" : "reminders"}
        </Button>
      </div>
    </Item>
  );
}

/* ---------- Step 4 ---------- */

function Trust({ setStep }: { setStep: (n: number) => void }) {
  return (
    <div>
      <Heading title="Needs you" sub="Your agents saved 22 hours last week." />
      <Item className="border-[#C9D8F3] bg-[var(--sh-blue-soft)]">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 size-5 shrink-0 text-[var(--sh-blue)]" aria-hidden />
          <div className="min-w-0">
            <h3 className="text-base font-semibold">You&apos;ve approved 18 status updates without a single edit.</h3>
            <p className="mt-1 text-sm text-[var(--sh-muted)]">
              Let the agent post them on its own and tell you after? You can switch it back any time.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className={darkBtn} onClick={() => setStep(5)}>
                Yes, let it post
              </Button>
              <Button variant="outline" className={lightBtn}>
                Keep asking
              </Button>
            </div>
          </div>
        </div>
      </Item>
    </div>
  );
}

/* ---------- Steps 5 and 6 ---------- */

const DONE = [
  { id: "post", text: "Posted Brightwater's weekly update", time: "Mon 9:00" },
  { id: "notes", text: "Turned Tuesday's call notes into 6 tasks", time: "Mon 8:40" },
  { id: "report", text: "Built October report for Northpoint Legal", time: "Mon 8:15" },
];

const REASONS = ["Wrong numbers", "Wrong tone", "Shouldn't have posted yet", "Something else"];

function NextMonday({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [undone, setUndone] = useState<string[]>([]);
  const [reason, setReason] = useState<string | null>(null);
  const brightUndone = step === 6;

  return (
    <div>
      <Heading title="Nothing needs you" sub="Your agents saved 24 hours last week." />
      <Item>
        <h3 className="text-base font-semibold">Done on its own</h3>
        <ul className="mt-2 divide-y divide-[var(--sh-line)]">
          {DONE.map((d) => {
            const isBright = d.id === "post";
            const isUndone = (isBright && brightUndone) || undone.includes(d.id);
            return (
              <li key={d.id} className="py-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p
                    className={cn(
                      "min-w-0 flex-1 text-sm",
                      isUndone && "text-[var(--sh-muted)] line-through",
                    )}
                  >
                    {d.text}
                    <span className="mono ml-2 text-[13px] text-[var(--sh-muted)]">{d.time}</span>
                  </p>
                  {isUndone ? (
                    <Chip tone="coral">Undone</Chip>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Undo: ${d.text}`}
                      onClick={() => (isBright ? setStep(6) : setUndone((u) => [...u, d.id]))}
                      className="rounded text-sm font-medium text-[var(--sh-blue)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sh-blue)]"
                    >
                      Undo
                    </button>
                  )}
                </div>
                {isBright && brightUndone && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 rounded-xl bg-[var(--sh-soft)] p-3"
                  >
                    {reason ? (
                      <p role="status" className="text-sm">
                        Thanks. Brightwater updates go back to asking you first, and the Aalpha team will take a
                        look.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-semibold">What was wrong?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {REASONS.map((r) => (
                            <Button key={r} variant="outline" className={cn(lightBtn, "h-8 px-3")} onClick={() => setReason(r)}>
                              {r}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
      </Item>
    </div>
  );
}

/* ---------- Bits ---------- */

function Chip({ tone, children }: { tone: "blue" | "coral" | "mint"; children: React.ReactNode }) {
  const map = {
    blue: "bg-[var(--sh-blue-soft)] text-[var(--sh-blue)]",
    coral: "bg-[var(--sh-coral-soft)] text-[var(--sh-coral)]",
    mint: "bg-[var(--sh-mint-soft)] text-[var(--sh-mint)]",
  } as const;
  return (
    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", map[tone])}>{children}</span>
  );
}
