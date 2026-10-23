import { fileClaim, openPolicy, type Policy } from "./claim.js";
import { type Customer, type QuoteItem, quotePremium } from "./premium.js";
import type { Damage } from "./reimbursement.js";

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
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

export interface ScenarioResults {
  results: unknown[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return fileClaim(policies.get(step.policy) as Policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer, policies.size > 0);
    policies.set(index, openPolicy(step.items));
    return { premium };
  });
  return { results };
}
