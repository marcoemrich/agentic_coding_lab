import { openPolicy, settleClaim, type Policy } from "./claims.js";
import { quotePremium } from "./premium.js";

export { policyBasePremium } from "./premium.js";

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

export interface Customer {
  yearsWithMHPCO: number;
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

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function runScenario(scenario: Scenario): (QuoteResult | ClaimResult)[] {
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const previousContracts = policies.size;
      policies.set(index, openPolicy(step.items));
      return { premium: quotePremium(step.items, scenario.customer, previousContracts) };
    }
    return settleClaim(policies.get(step.policy) ?? openPolicy([]), step.incident.damages);
  });
}
