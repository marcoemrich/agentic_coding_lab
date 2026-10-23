// Scenario processing — sequence of quote and claim steps.

import { claimPayout, type PolicyState } from "./claim.js";
import { CAP_MULTIPLIER, quotePolicy, type QuoteItem, type Customer } from "./quote.js";

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies: PolicyState[] = [];
  const results: StepResult[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const policy = quotePolicy(step.items, scenario.customer, quoteCount);
      policies.push({
        items: step.items,
        insuranceSum: policy.insuranceSum,
        premium: policy.premium,
        remainingCap: CAP_MULTIPLIER * policy.insuranceSum,
      });
      results.push({ premium: policy.premium });
      quoteCount += 1;
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`no policy at index ${step.policy}`);
      }
      const result = claimPayout(policy, step.incident.damages);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }
  return { results };
}
