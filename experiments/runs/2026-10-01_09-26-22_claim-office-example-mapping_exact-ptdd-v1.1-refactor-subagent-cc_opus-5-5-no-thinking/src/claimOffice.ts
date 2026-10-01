import { settleClaim } from "./claimPayout";
import { assertKnownItems } from "./itemCatalogue";
import { payoutCap } from "./payoutCap";
import { quotePremium } from "./quotePremium";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
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

interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

function isFollowUpContract(contractIndex: number): boolean {
  return contractIndex > 0;
}

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy) ?? { insuredItems: [], remainingCap: 0 };
      const settlement = settleClaim(policy.insuredItems, step.incident.damages, policy.remainingCap);
      policy.remainingCap = settlement.remainingCap;
      return settlement;
    }
    assertKnownItems(step.items);
    policies.set(stepIndex, { insuredItems: step.items, remainingCap: payoutCap(step.items) });
    return { premium: quotePremium(scenario.customer, step.items, isFollowUpContract(stepIndex)) };
  });
  return { results };
}
