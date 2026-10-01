import { claim, openPolicy } from "./claim.js";
import type { Incident, Policy } from "./claim.js";
import type { Customer, Item } from "./insured-item.js";
import { quote } from "./quote.js";

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

export interface QuoteResult {
  premium: number;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimStepResult;

// The MHPCO settles a scenario's steps in order for a single customer: each
// quote opens a policy the later claims draw on, and every quote after the
// customer's first is a follow-up contract.
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, previousContracts);
      previousContracts += 1;
      policies.set(stepIndex, openPolicy(step.items));
      return { premium };
    }
    const result = claim(policyFor(policies, step.policy), step.incident);
    policies.set(step.policy, result.policy);
    return { payout: result.payout, remainingCap: result.remainingCap };
  });
}

function policyFor(policies: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policies.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`step ${stepIndex} did not create a policy`);
  }
  return policy;
}
