import type { Item } from "./catalogue.js";
import { Policy, type ClaimResult, type Incident } from "./claim.js";
import { calculatePremium, type Customer } from "./premium.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface ScenarioOutput {
  results: ({ premium: number } | ClaimResult)[];
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        return (policies.get(step.policy) ?? new Policy([])).settleClaim(step.incident);
      }
      const isFollowUpContract = policies.size > 0;
      const premium = calculatePremium(step.items, scenario.customer, isFollowUpContract);
      policies.set(index, new Policy(step.items));
      return { premium };
    }),
  };
}
