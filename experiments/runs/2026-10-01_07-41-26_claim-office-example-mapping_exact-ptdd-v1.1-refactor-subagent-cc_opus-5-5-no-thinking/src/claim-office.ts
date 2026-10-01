import {
  type ClaimSettlement,
  type Damage,
  payoutCapOf,
  settleClaim,
} from "./claim-settlement.js";
import type { Item } from "./item-catalog.js";
import { type Customer, quotePremium } from "./premium.js";

export type { ClaimSettlement, Customer, Damage, Item };

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

export type StepResult = { premium: number } | ClaimSettlement;

// Every quote after the scenario's first one counts as a follow-up contract.
function hasEarlierContract(steps: Step[], index: number): boolean {
  return steps.slice(0, index).some((earlier) => earlier.op === "quote");
}

// A claim refers to its policy by the index of the quote step that issued it.
function claimedPolicyOf(steps: Step[], claim: ClaimStep): QuoteStep {
  return steps[claim.policy] as QuoteStep;
}

// Remaining caps are tracked per policy: before its first claim, a policy has its full payout cap.
function settleClaimAgainstPolicy(
  steps: Step[],
  claim: ClaimStep,
  remainingCaps: Map<number, number>,
): ClaimSettlement {
  const policyItems = claimedPolicyOf(steps, claim).items;
  const remainingCap =
    remainingCaps.get(claim.policy) ?? payoutCapOf(policyItems);
  const settlement = settleClaim(
    policyItems,
    claim.incident.damages,
    remainingCap,
  );
  remainingCaps.set(claim.policy, settlement.remainingCap);
  return settlement;
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      step.op === "claim"
        ? settleClaimAgainstPolicy(scenario.steps, step, remainingCaps)
        : {
            premium: quotePremium(
              step.items,
              scenario.customer,
              hasEarlierContract(scenario.steps, index),
            ),
          },
    ),
  };
}
