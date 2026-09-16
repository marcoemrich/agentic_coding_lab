import type { Item } from "./catalogue.js";
import { claim, openPolicy, type Incident, type Policy } from "./claim.js";
import { quote, type Customer } from "./quote.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

/** A claim step must name a quote step that actually created a policy. */
export class UnknownPolicyError extends Error {
  constructor(index: number) {
    super(`Step ${index} did not create a policy`);
    this.name = "UnknownPolicyError";
  }
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, previousContracts);
      policies.set(index, openPolicy(step.items));
      previousContracts += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new UnknownPolicyError(step.policy);
    }
    return claim(policy, step.incident);
  });

  return { results };
}
