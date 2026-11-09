import type { Metadata } from "next";
import { GiveLoopJourney } from "@/components/giveloop/giveloop-journey";

export const metadata: Metadata = { title: "Give Loop · Agent-first prototype" };

export default function Page() {
  return <GiveLoopJourney />;
}
