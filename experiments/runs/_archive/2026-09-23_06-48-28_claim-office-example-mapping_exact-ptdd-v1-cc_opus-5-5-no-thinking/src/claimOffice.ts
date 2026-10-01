import { openPolicy, settleClaim, type Damage, type Policy } from "./claim.js";
import type { Customer } from "./customer.js";
import type { Item } from "./item.js";
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

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, policies.size);
      policies.set(index, openPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy) as Policy;
    const payout = settleClaim(policy, step.incident.damages);
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
