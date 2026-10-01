import { insurePolicy, settleClaim, type Policy } from "./claim-settlement.js";
import { quotePremium } from "./quote-pricing.js";

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

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface ScenarioResults {
  results: object[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        const policy = policies.get(step.policy) ?? { items: [], remainingCap: 0 };
        const settlement = settleClaim(policy, step.incident.damages);
        policy.remainingCap = settlement.remainingCap;
        return settlement;
      }
      policies.set(index, insurePolicy(step.items));
      const hasEarlierQuote = index > 0;
      return { premium: quotePremium(step.items, scenario.customer, hasEarlierQuote) };
    }),
  };
}
