import { claimPayout, payoutCap, type Damage } from "./claim.js";
import { insuranceSum, quotePremium, type Item } from "./premium.js";

export type { Damage, Item };

export type QuoteStep = { op: "quote"; items: Item[] };

export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
};

export type ClaimResult = { payout: number; remainingCap: number };

export type Result = { premium: number } | ClaimResult;

export type ScenarioResults = { results: Result[] };

type Policy = { items: Item[]; remainingCap: number };

const issuePolicy = (items: Item[]): Policy => ({ items, remainingCap: payoutCap(insuranceSum(items)) });

// Payouts are limited by what is left of the policy's cap; the policy's remaining cap is reduced accordingly.
const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  const payout = Math.min(claimPayout(step.incident.damages, policy.items), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  // Claims refer to a policy by the zero-based index of the quote step that created it.
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") return processClaim(step, policies.get(step.policy) as Policy);
    const isFollowUp = policies.size > 0;
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp);
    policies.set(index, issuePolicy(step.items));
    return { premium };
  });
  return { results };
};
