import { type ClaimResult, type Damage, type Policy, openPolicy, processClaim } from "./claim.js";
import type { Item } from "./items.js";
import { type Customer, quotePremium } from "./premium.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        const isFollowUpContract = policies.size > 0;
        policies.set(index, openPolicy(step.items));
        return { premium: quotePremium(step.items, scenario.customer, isFollowUpContract) };
      }
      return processClaim(policies.get(step.policy) ?? openPolicy([]), step.incident.damages);
    }),
  };
}
