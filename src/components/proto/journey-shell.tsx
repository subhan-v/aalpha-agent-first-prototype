"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  /** Short title shown in the step list. */
  title: string;
  /** What is happening in this moment, in one or two sentences. */
  note: string;
  /** What to click to move on. */
  hint?: string;
};

export const PRODUCTS = [
  { href: "/giveloop", label: "Give Loop" },
  { href: "/headroom", label: "Headroom" },
  { href: "/shadow", label: "Shadow Studio" },
  { href: "/ci", label: "Culture Intelligence" },
] as const;

type Props = {
  product: string;
  persona: string;
  steps: JourneyStep[];
  step: number;
  setStep: (n: number) => void;
  children: React.ReactNode;
};

/**
 * Wraps one product's app screen with the prototype bar and the journey guide.
 * The screen derives everything from `step`, so Back, Next and Restart always work.
 */
export function JourneyShell({ product, persona, steps, step, setStep, children }: Props) {
  const [open, setOpen] = useState(false);
  const current = steps[step];
  const last = step === steps.length - 1;

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-30 bg-[#16191F] text-white pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2 overflow-x-auto px-[max(16px,env(safe-area-inset-left))] py-2 text-sm">
          <Link href="/" className="shrink-0 font-semibold pr-2">Agent-first prototypes</Link>
          {PRODUCTS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-[#C9CED8] hover:text-white",
                p.label === product && "bg-white/12 text-white font-semibold",
              )}
            >
              {p.label}
            </Link>
          ))}
          <span className="ml-auto shrink-0 text-xs text-[#9AA1AD]">Sample data</span>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 p-4 px-[max(16px,env(safe-area-inset-left))] items-start">
        {/* Journey guide: right column on desktop, collapsible strip on top for phones */}
        <aside className="lg:order-2 lg:sticky lg:top-[60px] rounded-xl border border-[#DADDE2] bg-white text-[#16191F] font-[family-name:var(--font-manrope)]">
          <button
            type="button"
            className="w-full flex items-center gap-3 p-4 text-left lg:cursor-default"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#16191F] text-white text-sm font-bold tabular-nums">
              {step + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-[#5E6470]">Step {step + 1} of {steps.length} · {product}</span>
              <span className="block font-semibold leading-snug">{current.title}</span>
            </span>
            <ChevronDown className={cn("ml-auto size-4 shrink-0 lg:hidden transition-transform", open && "rotate-180")} />
          </button>

          <div className={cn("px-4 pb-4 grid gap-4", !open && "hidden lg:grid")}>
            <p className="text-sm text-[#5E6470] -mt-1">{persona}</p>
            <div className="rounded-lg bg-[#F4F5F7] p-3 grid gap-2">
              <p className="text-sm leading-relaxed">{current.note}</p>
              {current.hint && (
                <p className="text-sm font-semibold text-[#9A6A1F]">→ {current.hint}</p>
              )}
            </div>

            <ol className="grid gap-1">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      "w-full flex gap-2.5 items-start rounded-md px-2 py-1.5 text-left text-sm",
                      i === step ? "bg-[#16191F] text-white" : "hover:bg-[#F4F5F7]",
                      i < step && "text-[#5E6470]",
                    )}
                  >
                    <span className="tabular-nums w-4 shrink-0 text-right">{i < step ? "✓" : i + 1}</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ArrowLeft /> Back
              </Button>
              {last ? (
                <Button variant="outline" size="sm" onClick={() => setStep(0)}>
                  <RotateCcw /> Start over
                </Button>
              ) : (
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  Skip ahead <ArrowRight />
                </Button>
              )}
            </div>
          </div>
        </aside>

        <main className="lg:order-1 min-w-0 @container">{children}</main>
      </div>
    </div>
  );
}
