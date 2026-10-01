import { type Item } from "./price-list.js";
import { type Customer, quote } from "./quote.js";
import { capFor } from "./policy.js";
import { type Damage, settleClaim } from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

/** A claim names the policy it is settled against by the index of the step that wrote it. */
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

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

interface WrittenPolicy {
  items: Item[];
  capRemaining: number;
}

function writePolicy(items: Item[]): WrittenPolicy {
  return { items, capRemaining: capFor(items) };
}

function policyClaimedBy(policies: Map<number, WrittenPolicy>, step: ClaimStep): WrittenPolicy {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Step ${step.policy} did not write a policy to claim against.`);
  }
  return policy;
}

/**
 * The office works a customer's steps in the order they were filed: each quote
 * writes a policy the later steps can claim against, and each is a follow-up
 * contract to the quotes already written for that customer.
 */
export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, WrittenPolicy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, policies.size);
      policies.set(stepIndex, writePolicy(step.items));
      return { premium };
    }
    const policy = policyClaimedBy(policies, step);
    const settlement = settleClaim(policy.items, step.incident.damages, policy.capRemaining);
    policy.capRemaining = settlement.remainingCap;
    return settlement;
  });
  return { results };
}
