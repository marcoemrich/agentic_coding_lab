import { payoutCap, settleClaim, type ClaimResult, type Damage } from "./claimSettlement.js";
import type { Item } from "./itemCatalog.js";
import { quotePremium, type Customer } from "./premiumQuote.js";

export type { ClaimResult, Customer, Damage, Item };

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export type QuoteResult = { premium: number };
export type Result = QuoteResult | ClaimResult;

function isFollowUpContract(earlierSteps: Scenario["steps"]): boolean {
  return earlierSteps.some((step) => step.op === "quote");
}

function referencedPolicy(steps: Scenario["steps"], claim: ClaimStep): QuoteStep {
  return steps[claim.policy] as QuoteStep;
}

function processClaim(steps: Scenario["steps"], remainingCaps: Map<number, number>, claim: ClaimStep): ClaimResult {
  const policy = referencedPolicy(steps, claim);
  const remainingCap = remainingCaps.get(claim.policy) ?? payoutCap(policy.items);
  const result = settleClaim(remainingCap, policy.items, claim.incident.damages);
  remainingCaps.set(claim.policy, result.remainingCap);
  return result;
}

export function runScenario(scenario: Scenario): Result[] {
  const remainingCaps = new Map<number, number>();
  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(scenario.steps, remainingCaps, step);
    }
    const followUpContract = isFollowUpContract(scenario.steps.slice(0, index));
    return { premium: quotePremium(scenario.customer, followUpContract, step.items) };
  });
}
