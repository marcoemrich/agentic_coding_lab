import { openPolicy, settleClaim, type Policy } from "./claim.js";
import { quotePremium } from "./premium.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
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

export type Result = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
      }
      const premium = quotePremium(step.items, { ...scenario.customer, previousContracts });
      previousContracts += 1;
      policies.set(index, openPolicy(step.items));
      return { premium };
    }),
  };
}
