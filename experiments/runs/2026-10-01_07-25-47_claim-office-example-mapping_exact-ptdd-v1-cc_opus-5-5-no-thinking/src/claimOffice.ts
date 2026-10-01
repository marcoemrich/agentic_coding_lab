import type { Item } from "./catalogue.js";
import { openPolicy, settleClaim, type Damage, type Policy, type Settlement } from "./claims.js";
import { premiumFor, type Customer } from "./premium.js";

export type { Item } from "./catalogue.js";
export type { Customer } from "./premium.js";

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

export type StepResult = QuoteResult | Settlement;

export interface ScenarioResults {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
    }
    const isFollowUpContract = policies.size > 0;
    policies.set(index, openPolicy(step.items));
    return { premium: premiumFor(scenario.customer, step.items, isFollowUpContract) };
  });
  return { results };
}
