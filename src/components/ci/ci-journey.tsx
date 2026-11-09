"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Home, Briefcase, Users, Settings, Hash, Send } from "lucide-react";
import { JourneyShell, type JourneyStep } from "@/components/proto/journey-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PERSONA =
  "You're Maya Ortiz, owner of Harbor & Pine, hiring an Account Manager. You live in Slack, so that's where Sia works with you.";

const STEPS: JourneyStep[] = [
  {
    title: "A candidate finishes",
    note: "You don't check a dashboard. Sia tells you in the channel the moment a result lands.",
    hint: "Click Compare finalists",
  },
  {
    title: "Ask Sia a question",
    note: "You ask in plain words. Sia picks the position, the benchmark and the scores for you.",
    hint: "Click Book Nora and James",
  },
  {
    title: "Sia finds the times",
    note: "Sia checks your calendar and Dev's, then proposes times. You just confirm.",
    hint: "Click Send invites",
  },
  {
    title: "Sia asks for a little more trust",
    note: "After 18 clean reminders, Sia asks once whether she can just send them.",
    hint: "Click Yes, send them",
  },
  {
    title: "Open the web app",
    note: "The app is now short: an ask box and what needs you.",
    hint: "Click Read it on Tessa's email",
  },
  {
    title: "Read before it goes",
    note: "Anything a candidate will read waits for you.",
    hint: "Click Send",
  },
  {
    title: "Close the role",
    note: "One click closes the position and drafts a short update to everyone still waiting.",
    hint: "Click Close and tell them",
  },
  {
    title: "All clear",
    note: "Nothing needs you. Sia keeps scoring and will tell you in Slack.",
  },
];

const SLOTS = {
  Nora: ["Tue 10:00", "Wed 2:00", "Thu 11:30"],
  James: ["Tue 3:30", "Wed 10:30", "Fri 9:00"],
} as const;
type Who = keyof typeof SLOTS;

export function CiJourney() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<Who, number>>({ Nora: 0, James: 0 });
  const next = () => setStep(step + 1);

  return (
    <div className="p-ci bg-[var(--ci-bg)]">
      <JourneyShell product="Culture Intelligence" persona={PERSONA} steps={STEPS} step={step} setStep={setStep}>
        {step <= 3 ? (
          <SlackWindow step={step} picked={picked} setPicked={setPicked} next={next} />
        ) : (
          <WebApp step={step} setStep={setStep} />
        )}
      </JourneyShell>
    </div>
  );
}

/* ---------------------------------- Slack --------------------------------- */

const slackGreen =
  "h-8 rounded-md border-[#007A5A] bg-[#007A5A] px-3 text-[13px] font-bold text-white hover:bg-[#006B4E]";
const slackOutline =
  "h-8 rounded-md border-[#868686] bg-white px-3 text-[13px] font-bold text-[#1D1C1D] hover:bg-[#F8F8F8]";
const slackLink = "h-auto p-0 text-[13px] font-normal text-[#1264A3] hover:underline";

function Msg({
  who,
  time,
  children,
}: {
  who: "sia" | "maya";
  time: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-2.5 px-4 py-2"
    >
      <div
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold",
          who === "sia" ? "bg-[var(--ci-blue)] text-white" : "bg-[#E8D9E8] text-[#3F0E40]",
        )}
      >
        {who === "sia" ? "S" : "MO"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] leading-snug">
          <span className="font-black">{who === "sia" ? "Sia" : "Maya Ortiz"}</span>
          {who === "sia" && (
            <span className="rounded bg-[#E8E8E8] px-1 text-[10px] font-bold leading-4 text-[#616061]">APP</span>
          )}
          <span className="text-xs text-[#616061]">{time}</span>
        </p>
        <div className="mt-0.5 grid gap-2 text-[15px] leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}

function ScoreRow({ name, score, tone, note }: { name: string; score: number; tone: "blue" | "red"; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="min-w-0">
        <span className="font-bold">{name}</span>
        {note && <span className="block text-[13px] text-[var(--ci-red-ink)]">{note}</span>}
      </span>
      <span
        className={cn(
          "mono shrink-0 rounded px-1.5 text-sm font-semibold tabular-nums",
          tone === "blue" ? "bg-[var(--ci-blue-soft)] text-[var(--ci-blue-ink)]" : "bg-[var(--ci-red-soft)] text-[var(--ci-red-ink)]",
        )}
      >
        {score}
      </span>
    </div>
  );
}

function SlackWindow({
  step,
  picked,
  setPicked,
  next,
}: {
  step: number;
  picked: Record<Who, number>;
  setPicked: (p: Record<Who, number>) => void;
  next: () => void;
}) {
  return (
    <section
      aria-label="Slack, hiring channel"
      className="slack overflow-hidden rounded-xl border border-[var(--ci-line)] bg-white shadow-[0_8px_24px_-12px_rgba(11,13,18,0.25)]"
    >
      <div className="flex items-center gap-2 bg-[#3F0E40] px-4 py-3 text-white">
        <Hash className="size-4" aria-hidden />
        <span className="font-bold">hiring</span>
        <span className="ml-auto text-xs text-white/70">Harbor & Pine</span>
      </div>

      <div className="min-h-[420px] py-3">
        <Msg who="sia" time="9:02 AM">
          <p>Nora Feld just finished. 97 for Account Manager, the closest match yet to Priya.</p>
          <div className="border-l-4 border-[var(--ci-blue)] pl-3 text-[14px]">97 · Influencer · meets all 4 must-haves</div>
          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={slackOutline}>See report</Button>
              <Button className={slackGreen} onClick={next}>Compare finalists</Button>
            </div>
          )}
        </Msg>

        {step >= 1 && (
          <Msg who="maya" time="9:04 AM">
            <p>
              <span className="rounded bg-[#E8F5FA] px-0.5 text-[#1264A3]">@Sia</span> how do the Account Manager
              finalists compare to Priya?
            </p>
          </Msg>
        )}
        {step >= 1 && (
          <Msg who="sia" time="9:04 AM">
            <p>Nora is the closest match to Priya. I&apos;d interview Nora and James.</p>
            <div className="grid gap-2 border-l-4 border-[var(--ci-blue)] pl-3">
              <ScoreRow name="Nora Feld" score={97} tone="blue" />
              <ScoreRow name="James Okafor" score={84} tone="blue" />
              <ScoreRow name="Liam Chen" score={61} tone="red" note="misses a must-have: steady under client pressure" />
            </div>
            <p className="flex flex-wrap items-center gap-x-1 text-xs text-[#616061]">
              Compared against Priya Shah (94) on the Account Manager criteria ·
              <Button variant="link" className={cn(slackLink, "text-xs")}>Change benchmark</Button>·
              <Button variant="link" className={cn(slackLink, "text-xs")}>Full reports</Button>
            </p>
            {step === 1 && (
              <div>
                <Button className={slackGreen} onClick={next}>Book Nora and James</Button>
              </div>
            )}
          </Msg>
        )}

        {step >= 2 && (
          <Msg who="sia" time="9:05 AM">
            <p>These work for you and Dev this week:</p>
            <div className="grid gap-3 border-l-4 border-[var(--ci-blue)] pl-3">
              {(Object.keys(SLOTS) as Who[]).map((who) => (
                <div key={who} className="grid gap-1.5">
                  <span className="font-bold">{who === "Nora" ? "Nora Feld" : "James Okafor"}</span>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Time for ${who}`}>
                    {SLOTS[who].map((t, i) => {
                      const on = picked[who] === i;
                      return (
                        <Button
                          key={t}
                          variant="outline"
                          role="radio"
                          aria-checked={on}
                          disabled={step !== 2}
                          onClick={() => setPicked({ ...picked, [who]: i })}
                          className={cn(
                            "h-8 rounded-md px-3 text-[13px] font-semibold disabled:opacity-100",
                            on
                              ? "border-[var(--ci-blue)] bg-[var(--ci-blue-soft)] text-[var(--ci-blue-ink)]"
                              : "border-[var(--ci-line)] bg-white text-[var(--ci-muted)]",
                          )}
                        >
                          {on && <Check className="size-3.5" aria-hidden />}
                          {t}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {step === 2 && (
              <div>
                <Button className={slackGreen} onClick={next}>Send invites</Button>
              </div>
            )}
          </Msg>
        )}

        {step >= 3 && (
          <>
            <Msg who="sia" time="9:06 AM">
              <p>Invites sent. Nora and James will get a calendar link.</p>
              <p className="text-[13px] text-[#616061]">
                Nora {SLOTS.Nora[picked.Nora]} · James {SLOTS.James[picked.James]}
              </p>
            </Msg>
            <Msg who="sia" time="9:06 AM">
              <p>
                I&apos;ve sent 18 assessment reminders this month and none needed changes. Want me to just send them
                from now on? I&apos;ll list them in Friday&apos;s recap.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button className={slackGreen} onClick={next}>Yes, send them</Button>
                <Button variant="outline" className={slackOutline} onClick={next}>Keep asking</Button>
              </div>
            </Msg>
          </>
        )}
      </div>

      <div className="border-t border-[var(--ci-line)] p-3">
        <div className="rounded-lg border border-[#868686] px-3 py-2 text-sm text-[#616061]">Message #hiring</div>
      </div>
    </section>
  );
}

/* --------------------------------- Web app -------------------------------- */

const NAV = [
  { label: "Home", icon: Home },
  { label: "Positions", icon: Briefcase },
  { label: "People", icon: Users },
  { label: "Settings", icon: Settings },
];

const emailBody = [
  "Thank you for the time you put into your Account Manager application at Harbor & Pine.",
  "After careful thought, we are moving forward with other candidates. This role needs someone who stays steady under daily client pressure, and we think another fit is closer for now.",
  "That is a narrow call about one role, not a verdict on you.",
  "We hope you keep going, and we would be glad to hear from you again.",
];

function WebApp({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const tessaDone = step >= 6;
  const marcusDone = step >= 7;
  const clear = tessaDone && marcusDone;

  return (
    <section
      aria-label="Culture Intelligence web app"
      className="overflow-hidden rounded-xl border border-[var(--ci-line)] bg-[var(--ci-bg)] shadow-[0_8px_24px_-12px_rgba(11,13,18,0.25)]"
    >
      <div className="flex h-14 items-center justify-between bg-[var(--ci-ink)] px-4">
        <span className="display text-base font-bold text-white">Culture Intelligence</span>
        <Button className="h-9 rounded-lg bg-[var(--ci-blue)] px-4 font-semibold text-white hover:bg-[var(--ci-blue-ink)]">
          Ask Sia
        </Button>
      </div>

      <div className="flex flex-col @3xl:flex-row">
        <nav
          aria-label="Main"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--ci-line)] bg-white p-2 @3xl:w-52 @3xl:flex-col @3xl:overflow-visible @3xl:border-b-0 @3xl:border-r @3xl:p-3"
        >
          <p className="mb-2 hidden px-2 @3xl:block">
            <span className="display block text-sm font-bold">Culture Intelligence</span>
            <span className="block text-xs text-[var(--ci-faint)]">Harbor & Pine</span>
          </p>
          {NAV.map(({ label, icon: Icon }, i) => (
            <Button
              key={label}
              variant="ghost"
              aria-current={i === 0 ? "page" : undefined}
              className={cn(
                "h-9 shrink-0 justify-start gap-2 rounded-lg px-3 text-sm",
                i === 0 ? "bg-[var(--ci-mist)] font-semibold text-[var(--ci-ink)]" : "text-[var(--ci-muted)]",
              )}
            >
              <Icon aria-hidden /> {label}
            </Button>
          ))}
        </nav>

        <div className="grid min-w-0 flex-1 content-start gap-5 p-4 @3xl:p-8">
          <h1 className="display text-3xl font-extrabold @3xl:text-4xl">Morning, Maya</h1>

          <div className="flex items-end gap-2 rounded-xl border border-[var(--ci-line)] bg-white p-2 shadow-[0_1px_2px_rgba(11,13,18,0.06),0_8px_16px_-12px_rgba(11,13,18,0.2)]">
            <Textarea
              aria-label="Ask Sia"
              rows={1}
              placeholder="Ask about a candidate, your team or a role"
              className="min-h-10 min-w-0 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button size="icon" aria-label="Send question" className="size-9 shrink-0 rounded-lg bg-[var(--ci-blue)] text-white hover:bg-[var(--ci-blue-ink)]">
              <Send />
            </Button>
          </div>

          <div className="rounded-xl border border-[var(--ci-line)] bg-white p-4 shadow-[0_1px_2px_rgba(11,13,18,0.06),0_8px_16px_-12px_rgba(11,13,18,0.2)]">
            <h2 className="display mb-3 text-lg font-bold">{clear ? "Nothing needs you" : "Needs you"}</h2>
            {clear ? (
              <p className="text-sm text-[var(--ci-muted)]">Sia keeps scoring and will tell you in Slack.</p>
            ) : (
              <ul className="divide-y divide-[var(--ci-line)]">
                <li className="py-3 first:pt-0">
                  {tessaDone ? (
                    <DoneLine>Sent to Tessa · 9:41 AM</DoneLine>
                  ) : (
                    <Row
                      title="Tessa Quinn misses a must-have"
                      body="Account Manager. Sia drafted a kind no-thanks email."
                    >
                      <Button
                        className="h-8 rounded-lg bg-[var(--ci-blue)] px-3 text-white hover:bg-[var(--ci-blue-ink)]"
                        onClick={() => setStep(6)}
                      >
                        Send it
                      </Button>
                      <Button variant="outline" className="h-8 rounded-lg px-3" onClick={() => setStep(5)}>
                        Read it
                      </Button>
                    </Row>
                  )}
                </li>
                <li className="py-3 last:pb-0">
                  {marcusDone ? (
                    <DoneLine>Account Manager closed · 10 applicants told</DoneLine>
                  ) : (
                    <Row
                      title="Marcus Bell was hired"
                      body="Close Account Manager and tell the other 10 applicants?"
                    >
                      <Button
                        className="h-8 rounded-lg bg-[var(--ci-blue)] px-3 text-white hover:bg-[var(--ci-blue-ink)]"
                        disabled={!tessaDone}
                        onClick={() => setStep(7)}
                      >
                        Close and tell them
                      </Button>
                    </Row>
                  )}
                </li>
              </ul>
            )}
          </div>

          <p className="text-sm text-[var(--ci-muted)]">
            Sia scored 6 new results since Friday.{" "}
            <Button variant="link" className="h-auto p-0 text-sm text-[var(--ci-blue-ink)]">See them</Button>
          </p>
        </div>
      </div>

      <Sheet open={step === 5} onOpenChange={(o) => !o && setStep(4)}>
        <SheetContent side="right" className="p-ci p-0 w-full bg-white data-[side=right]:sm:max-w-md data-[side=right]:lg:right-[352px] data-[side=right]:lg:inset-y-4 data-[side=right]:lg:h-auto lg:rounded-2xl lg:border">
          <SheetHeader className="border-b border-[var(--ci-line)] p-4">
            <SheetTitle className="display text-lg font-bold">Read before it goes</SheetTitle>
            <SheetDescription>To Tessa Quinn</SheetDescription>
          </SheetHeader>
          <div className="min-w-0 flex-1 overflow-y-auto px-4">
            <p className="text-xs text-[var(--ci-faint)]">Subject</p>
            <p className="mb-4 font-semibold">Your Account Manager application at Harbor & Pine</p>
            <div className="grid gap-3 text-[15px] leading-relaxed text-[var(--ci-ink)]">
              <p>Hi Tessa,</p>
              {emailBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>Maya Ortiz<br />Harbor & Pine</p>
            </div>
          </div>
          <SheetFooter className="flex-row border-t border-[var(--ci-line)] p-4">
            <Button
              className="h-9 flex-1 rounded-lg bg-[var(--ci-blue)] text-white hover:bg-[var(--ci-blue-ink)]"
              onClick={() => setStep(6)}
            >
              Send
            </Button>
            <Button variant="outline" className="h-9 flex-1 rounded-lg">Edit</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function Row({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 @lg:flex-row @lg:items-center @lg:justify-between">
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-[var(--ci-muted)]">{body}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
    </div>
  );
}

function DoneLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm text-[var(--ci-muted)]">
      <span className="grid size-5 place-items-center rounded-full bg-[var(--ci-blue-soft)] text-[var(--ci-blue-ink)]">
        <Check className="size-3" aria-hidden />
      </span>
      <span className="min-w-0">{children}</span>
    </p>
  );
}
