import { type Damage, type Policy, fileClaim, openPolicy } from "./claim.js";
import type { Item } from "./price-list.js";
import { quotePremium } from "./quote.js";

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const { yearsWithMHPCO } = scenario.customer;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        policies.set(index, openPolicy(step.items));
        return { premium: quotePremium(step.items, { yearsWithMHPCO, isFollowUpContract: index > 0 }) };
      }
      const policy = policies.get(step.policy) as Policy;
      return fileClaim(policy, step.incident.damages);
    }),
  };
}
