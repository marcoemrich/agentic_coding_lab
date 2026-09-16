import { claim, policyFor, quote } from "./claim-office.js";
import type { Customer, Damage, Item, Policy } from "./claim-office.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, policies.size);
      policies.set(index, policyFor(step.items));
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`step ${index}: no policy created by step ${step.policy}`);
    }
    const result = claim(policy, step.incident.damages);
    policy.remainingCap = result.remainingCap;
    results.push(result);
  });

  return results;
}
