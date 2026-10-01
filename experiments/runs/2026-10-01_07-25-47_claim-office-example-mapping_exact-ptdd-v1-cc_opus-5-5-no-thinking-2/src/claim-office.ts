import type { ItemInput } from "./item.js";
import { openPolicy, settleClaim, type DamageInput, type Policy } from "./claim.js";
import { quotePremium } from "./premium.js";

export type { ItemInput };

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageInput[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const { yearsWithMHPCO } = scenario.customer;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy) ?? openPolicy([]), step.incident.damages);
    }
    const premium = quotePremium(step.items, { yearsWithMHPCO, previousContracts: policies.size });
    policies.set(stepIndex, openPolicy(step.items));
    return { premium };
  });
  return { results };
}
