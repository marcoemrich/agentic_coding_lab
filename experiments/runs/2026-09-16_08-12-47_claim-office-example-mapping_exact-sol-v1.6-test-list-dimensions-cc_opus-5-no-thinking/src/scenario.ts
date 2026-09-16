import { quote } from "./claim-office.js";
import { settleClaim, type Incident } from "./claim.js";
import type { Customer } from "./customer.js";
import type { Item } from "./item.js";
import { createPolicy, type Policy } from "./policy.js";

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

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

function policyFor(policies: Map<number, Policy>, step: ClaimStep): Policy {
  const policy = policies.get(step.policy);
  if (policy === undefined) throw new Error(`No policy created by step ${step.policy}`);
  return policy;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quote(scenario.customer, step.items, policies.size) });
      policies.set(index, createPolicy(step.items));
      return;
    }
    results.push(settleClaim(policyFor(policies, step), step.incident));
  });

  return { results };
}
