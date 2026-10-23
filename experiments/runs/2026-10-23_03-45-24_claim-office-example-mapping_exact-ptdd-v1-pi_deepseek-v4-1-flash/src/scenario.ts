import { policyCap, processClaim, type PolicyState } from "./policy.js";
import { quotePremium, type Customer, type Item } from "./pricing.js";
import type { Damage } from "./claims.js";

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

export interface ScenarioResult {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies: PolicyState[] = [];
  const results: StepResult[] = [];
  let quotesSoFar = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const contract = { isFollowUpContract: quotesSoFar > 0 };
      const premium = quotePremium(step.items, scenario.customer, contract);
      quotesSoFar += 1;
      policies.push({ items: step.items, remainingCap: policyCap(step.items) });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (policy === undefined) {
        throw new Error(`unknown policy index: ${step.policy}`);
      }
      const claim = processClaim(policy, step.incident.damages);
      policy.remainingCap = claim.remainingCap;
      results.push(claim);
    }
  }

  return { results };
}
