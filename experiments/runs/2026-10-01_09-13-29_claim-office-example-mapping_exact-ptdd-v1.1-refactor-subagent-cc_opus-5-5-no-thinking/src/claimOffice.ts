import { payoutCapFor, payoutFor, payoutWithinRemainingCap, type Damage } from "./claimSettlement.js";
import type { InsuredItem } from "./itemCatalogue.js";
import { premiumFor, type Customer } from "./premium.js";

export type { Customer, Damage, InsuredItem };

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
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

interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

function openPolicy(items: InsuredItem[]): Policy {
  return { items, remainingCap: payoutCapFor(items) };
}

function settleClaim(step: ClaimStep, policy: Policy): ClaimResult {
  const payout = payoutWithinRemainingCap(payoutFor(step.incident.damages, policy.items), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return settleClaim(step, policies.get(step.policy) as Policy);
    }
    policies.set(index, openPolicy(step.items));
    return { premium: premiumFor(step.items, scenario.customer, index) };
  });
  return { results };
}
