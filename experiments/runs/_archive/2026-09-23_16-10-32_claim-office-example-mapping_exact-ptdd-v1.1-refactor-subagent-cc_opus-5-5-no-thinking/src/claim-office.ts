import { type Damage, settleClaim } from "./claims";
import type { InsuredItem } from "./insured-item";
import { openPolicy, type Policy } from "./policy";
import { type Customer, isAfterFirstQuote, quotePremium } from "./premium";

export type { InsuredItem } from "./insured-item";

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  // A policy is identified by the zero-based index of the quote step that created it.
  const policiesByQuoteStep = new Map<number, Policy>();
  let quotesSoFar = 0;
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") return settleClaim(step.incident.damages, policiesByQuoteStep.get(step.policy) as Policy);
    policiesByQuoteStep.set(stepIndex, openPolicy(step.items));
    return { premium: quotePremium(step.items, scenario.customer, isAfterFirstQuote(quotesSoFar++)) };
  });
  return { results };
}
