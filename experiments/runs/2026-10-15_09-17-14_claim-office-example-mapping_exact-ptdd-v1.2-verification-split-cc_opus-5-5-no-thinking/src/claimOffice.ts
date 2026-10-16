import type { Customer } from "./customer.js";
import type { Damage, Item } from "./item.js";
import { claimPayout, policyCap } from "./payout.js";
import { quotePremium } from "./premium.js";

export type { Customer, Damage, Item };

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

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const followUpContract = policies.size > 0;
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      return { premium: quotePremium(step.items, scenario.customer, followUpContract) };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`No policy created by step ${step.policy}`);
    }
    const result = claimPayout(policy.items, step.incident.damages, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
  return { results };
}
