import { insurePolicy, settleClaim, type ClaimResult, type Damage, type Policy } from "./claim.js";
import { quotePremium, type Customer } from "./premium.js";
import type { Item } from "./priceList.js";

export type { Damage, Item };

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

export interface QuoteResult {
  premium: number;
}

export function processScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;
  const results = scenario.steps.map((step, index): QuoteResult | ClaimResult => {
    if (step.op === "quote") {
      policies.set(index, insurePolicy(step.items));
      const premium = quotePremium(step.items, scenario.customer, quotesSoFar > 0);
      quotesSoFar += 1;
      return { premium };
    }
    return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
  });
  return { results };
}
