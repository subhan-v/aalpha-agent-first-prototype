"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight, Loader2, Smartphone } from "lucide-react";
import { JourneyShell, type JourneyStep } from "@/components/proto/journey-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STEPS: JourneyStep[] = [
  {
    title: "Say what you want to send",
    note: "No menus, no segment builder. You describe the text the way you'd ask a colleague.",
    hint: "Click the first suggestion, then Build it",
  },
  {
    title: "Give Loop does the setup",
    note: "It finds the donors, removes anyone who opted out, picks the banner and writes the draft. This is the work that used to take five screens.",
    hint: "Click See the draft",
  },
  {
    title: "Check the draft",
    note: "One card: who gets it, when, what it costs, and how it looks on a phone. You can ask for changes in plain words.",
    hint: "Try Make it shorter, then click Send me a test",
  },
  {
    title: "Test it on your phone",
    note: "The test goes to the CM team first. Big sends always need a second person, so you ask for approval.",
    hint: "Click Ask Yusuf to approve",
  },
  {
    title: "Yusuf approves",
    note: "You're now Yusuf. He sees the same facts, the test result and who asked. Give Loop can draft but can never approve or send.",
    hint: "Click Approve",
  },
  {
    title: "It goes out, and the report comes back",
    note: "The text sends at 7:30 PM in each donor's time zone. The next morning you get results, and replies already have drafted answers.",
  },
];

const SUGGESTIONS = [
  "Text everyone who gave in Ramadan 1446 but not 1447. Tonight 7:30 their time, with the year-end banner.",
  "Remind tonight's RSVPs about the 8 PM livestream",
  "Thank first-time donors from this week",
];

const DRAFT_LONG =
  "Salaam {first_name}, thank you for standing with us in Ramadan 1446. Before the year ends, help us bring the Prophet's story ﷺ to 10,000 more homes: c-m.io/yearend";
const DRAFT_SHORT = "Salaam {first_name}, we missed you this Ramadan. Join us before the year ends: c-m.io/yearend";

function personalize(text: string) {
  return text.replace("{first_name}", "Amina");
}

export function GiveLoopJourney() {
  const [step, setStep] = useState(0);
  return (
    <JourneyShell
      product="Give Loop"
      persona="You're Amina on CelebrateMercy's team. A year-end text needs to go out tonight to donors who lapsed."
      steps={STEPS}
      step={step}
      setStep={setStep}
    >
      <div className="p-gl rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] overflow-hidden grid @3xl:grid-cols-[200px_minmax(0,1fr)] min-h-[640px]">
        <Sidebar approver={step === 4} />
        <div className="bg-[var(--gl-bg)] min-w-0 px-4 py-6 @3xl:px-8 @3xl:py-8">
          <div className="mx-auto max-w-[760px] grid gap-5">
            {step === 0 && <AskStep onBuild={() => setStep(1)} />}
            {step === 1 && <BuildingStep onDone={() => setStep(2)} />}
            {step === 2 && <DraftStep onTest={() => setStep(3)} />}
            {step === 3 && <TestStep onRequest={() => setStep(4)} />}
            {step === 4 && <ApproveStep onApprove={() => setStep(5)} />}
            {step === 5 && <ReportStep />}
          </div>
        </div>
      </div>
    </JourneyShell>
  );
}

function Sidebar({ approver }: { approver: boolean }) {
  const items = ["Ask", "Campaigns", "Inbox", "Contacts", "Settings"];
  const active = approver ? "Campaigns" : "Ask";
  return (
    <aside className="border-b @3xl:border-b-0 @3xl:border-r border-[var(--gl-line)] p-3 @3xl:p-4 flex @3xl:flex-col gap-1 overflow-x-auto items-center @3xl:items-stretch">
      <div className="shrink-0 px-2 @3xl:pb-4 pr-4">
        <div className="font-bold">Give Loop</div>
        <div className="text-xs text-[var(--gl-muted)]">CelebrateMercy · 67053</div>
      </div>
      {items.map((it) => (
        <span
          key={it}
          className={cn(
            "shrink-0 rounded-lg px-2.5 py-2 text-[15px]",
            it === active && "bg-[var(--gl-accent-soft)] text-[var(--gl-accent-text)] font-semibold",
          )}
        >
          {it}
          {it === "Inbox" && (
            <span className="ml-2 rounded-full bg-[var(--gl-fg)] px-1.5 text-[11px] text-white mono">4</span>
          )}
        </span>
      ))}
      {approver && (
        <span className="shrink-0 @3xl:mt-auto rounded-lg bg-[var(--gl-warn-bg)] text-[var(--gl-warn)] text-xs px-2.5 py-2">
          Signed in as Yusuf
        </span>
      )}
    </aside>
  );
}

const primary =
  "h-10 px-4 rounded-lg bg-[var(--gl-accent)] text-white font-semibold hover:bg-[var(--gl-accent-text)]";
const secondary =
  "h-10 px-4 rounded-lg border-[var(--gl-line)] bg-[var(--gl-surface)] text-[var(--gl-fg)] hover:bg-[var(--gl-sunk)]";

function AskStep({ onBuild }: { onBuild: () => void }) {
  const [text, setText] = useState("");
  return (
    <>
      <h2 className="text-2xl font-semibold">What do you want to send?</h2>
      <div className="rounded-xl border-[1.5px] border-[var(--gl-accent)] bg-[var(--gl-surface)] p-3 grid gap-3">
        <Textarea
          id="gl-ask"
          aria-label="Describe the text you want to send"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Who should get it, what it's for, and when"
          className="min-h-[84px] border-0 shadow-none focus-visible:ring-0 text-base resize-none p-1"
        />
        <div className="flex justify-end">
          <Button className={primary} disabled={!text.trim()} onClick={onBuild}>
            Build it
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <span className="text-sm text-[var(--gl-muted)]">Try one</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className={cn(
                "text-left rounded-lg border border-dashed border-[var(--gl-line)] bg-[var(--gl-surface)] px-3 py-2 text-sm hover:border-[var(--gl-accent)] focus-visible:outline-2 focus-visible:outline-[var(--gl-accent)]",
                i === 0 && "border-[var(--gl-accent)] text-[var(--gl-accent-text)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-[var(--gl-muted)]">
        Also this week: 47 monthly donors have cards that expire in November.{" "}
        <span className="font-semibold text-[var(--gl-accent-text)] underline underline-offset-4">Draft a reminder</span>
      </p>
    </>
  );
}

const BUILD_ITEMS = [
  "Found 1,408 people who gave in Ramadan 1446 and not in 1447",
  "Removed the CM team and 196 numbers that opted out",
  "Picked the newest banner: year-end-banner.jpg",
  "Wrote a draft in the style of your last 5 approved texts",
];

function BuildingStep({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? BUILD_ITEMS.length : 0);
  useEffect(() => {
    if (shown >= BUILD_ITEMS.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 450);
    return () => clearTimeout(t);
  }, [shown]);
  const done = shown >= BUILD_ITEMS.length;
  return (
    <>
      <RequestEcho />
      <div className="rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] p-5 grid gap-3">
        <div className="flex items-center gap-2 font-semibold">
          {done ? <Check className="size-5 text-[var(--gl-accent)]" /> : <Loader2 className="size-5 animate-spin text-[var(--gl-accent)]" />}
          {done ? "Ready" : "Setting it up"}
        </div>
        <ul className="grid gap-2">
          {BUILD_ITEMS.map((item, i) => (
            <li key={item} className={cn("flex gap-2 text-[15px] transition-opacity", i < shown ? "opacity-100" : "opacity-30")}>
              <Check className={cn("size-4 mt-1 shrink-0", i < shown ? "text-[var(--gl-accent)]" : "text-[var(--gl-line)]")} />
              {item}
            </li>
          ))}
        </ul>
        <div>
          <Button className={primary} disabled={!done} onClick={onDone}>
            See the draft <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}

function RequestEcho() {
  return (
    <p className="rounded-xl bg-[var(--gl-sunk)] px-4 py-3 text-[15px]">
      &ldquo;{SUGGESTIONS[0]}&rdquo;
    </p>
  );
}

function Phone({ text, label = "67053" }: { text: string; label?: string }) {
  return (
    <div className="rounded-[22px] bg-[var(--gl-sunk)] p-3 grid gap-2 w-full max-w-[260px] justify-self-center">
      <div className="text-center text-xs text-[var(--gl-muted)]">{label}</div>
      <div className="rounded-xl bg-[#E2DED6] aspect-[16/10] grid place-items-center text-xs text-[var(--gl-muted)]">
        year-end banner
      </div>
      <div className="rounded-xl bg-[var(--gl-surface)] p-2.5 text-[13px] leading-snug">
        CelebrateMercy: {personalize(text)}
      </div>
    </div>
  );
}

function Facts() {
  return (
    <p className="text-base leading-relaxed">
      <b className="mono font-medium">1,184</b> lapsed donors · tonight at <b className="mono font-medium">7:30 PM</b> their time ·{" "}
      <b className="mono font-medium">3,552</b> credits
    </p>
  );
}

function DraftStep({ onTest }: { onTest: () => void }) {
  const [short, setShort] = useState(false);
  const text = short ? DRAFT_SHORT : DRAFT_LONG;
  return (
    <>
      <RequestEcho />
      <div className="rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] p-5 grid @4xl:grid-cols-[minmax(0,1fr)_240px] gap-6 items-start">
        <div className="grid gap-4 min-w-0">
          <Facts />
          <motion.p
            key={text}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-[var(--gl-line)] px-3.5 py-3 text-[15px] leading-relaxed"
          >
            {text}
          </motion.p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-[var(--gl-line)]" onClick={() => setShort((s) => !s)}>
              {short ? "Use the longer one" : "Make it shorter"}
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-[var(--gl-line)]">Warmer</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-[var(--gl-line)]">Send tomorrow at 10 AM</Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button className={primary} onClick={onTest}>Send me a test</Button>
            <span className="text-sm text-[var(--gl-muted)]">Nothing goes to donors yet.</span>
          </div>
          <details className="text-sm text-[var(--gl-muted)] group">
            <summary className="cursor-pointer font-semibold list-none flex items-center gap-1">
              <ChevronRight className="size-4 transition-transform group-open:rotate-90" /> How I built this
            </summary>
            <ul className="mt-2 grid gap-1 pl-5 list-disc">
              {BUILD_ITEMS.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </details>
        </div>
        <Phone text={text} />
      </div>
    </>
  );
}

function TestStep({ onRequest }: { onRequest: () => void }) {
  return (
    <>
      <div className="rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] p-5 grid @4xl:grid-cols-[minmax(0,1fr)_240px] gap-6 items-start">
        <div className="grid gap-4 min-w-0">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Smartphone className="size-5 text-[var(--gl-accent)]" /> Test sent to the CM team
          </div>
          <p className="text-[15px]">
            <b className="mono font-medium">27 of 28</b> delivered. The banner and link both work.
          </p>
          <p className="text-[15px] text-[var(--gl-muted)]">
            This goes to more than 1,000 people, so someone else approves it before it sends.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button className={primary} onClick={onRequest}>Ask Yusuf to approve</Button>
            <Button variant="outline" className={secondary}>Change something</Button>
          </div>
        </div>
        <Phone text={DRAFT_LONG} label="Your phone · test" />
      </div>
    </>
  );
}

function ApproveStep({ onApprove }: { onApprove: () => void }) {
  const rows: [string, string][] = [
    ["Requested by", "Amina, 5:12 PM"],
    ["Who gets it", "1,184 lapsed donors"],
    ["When", "Tonight, 7:30 PM their time"],
    ["Cost", "3,552 credits"],
    ["Test", "27 of 28 delivered"],
  ];
  return (
    <>
      <h2 className="text-2xl font-semibold">Approve this send?</h2>
      <div className="rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] p-5 grid gap-4">
        <dl className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-4 gap-y-2 text-[15px]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[var(--gl-muted)]">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="rounded-lg bg-[var(--gl-sunk)] px-3.5 py-3 text-[15px] leading-relaxed">CelebrateMercy: {DRAFT_LONG}</p>
        <div className="flex flex-wrap gap-2">
          <Button className={primary} onClick={onApprove}>Approve</Button>
          <Button variant="outline" className={secondary}>Send back with a note</Button>
        </div>
        <p className="text-sm text-[var(--gl-muted)]">{"The person who wrote it can't approve it. Give Loop can't approve or send."}</p>
      </div>
    </>
  );
}

function ReportStep() {
  const stats: [string, string][] = [
    ["Delivered", "1,171"],
    ["Clicked", "214"],
    ["Gave", "38"],
    ["Raised", "$4,560"],
  ];
  return (
    <>
      <div className="flex items-center gap-2 text-[var(--gl-accent-text)] font-semibold">
        <Check className="size-5" /> Approved by Yusuf. Sent at 7:30 PM in each time zone.
      </div>
      <h2 className="text-2xl font-semibold">Next morning: year-end lapsed donors</h2>
      <div className="grid grid-cols-2 @lg:grid-cols-4 rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] overflow-hidden">
        {stats.map(([k, v]) => (
          <div key={k} className="p-4 border-[var(--gl-line)] odd:border-r @lg:border-r @lg:last:border-r-0 [&:nth-child(-n+2)]:border-b @lg:[&:nth-child(-n+2)]:border-b-0">
            <div className="text-sm text-[var(--gl-muted)]">{k}</div>
            <div className="mono text-2xl font-medium tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--gl-line)] bg-[var(--gl-surface)] p-5 grid gap-3">
        <div className="font-semibold">12 replies came in</div>
        <p className="text-[15px] text-[var(--gl-muted)]">
          Give Loop drafted answers for 9 of them. 3 need a person: two asked about zakat eligibility and one asked to talk to someone.
        </p>
        <div>
          <Button className={primary}>Open the inbox</Button>
        </div>
      </div>
    </>
  );
}
