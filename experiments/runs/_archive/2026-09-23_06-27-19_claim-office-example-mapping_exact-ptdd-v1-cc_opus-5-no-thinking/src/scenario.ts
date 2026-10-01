import { claim, openPolicy, quote } from "./claim-office.js";
import type { Customer, Incident, Item, Policy } from "./claim-office.js";

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

function policyFor(policies: Map<number, Policy>, step: ClaimStep): Policy {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Step ${step.policy} did not create a policy`);
  }
  return policy;
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contracts);
      contracts += 1;
      policies.set(index, openPolicy(step.items));
      return { premium };
    }
    return claim(policyFor(policies, step), step.incident);
  });
}
