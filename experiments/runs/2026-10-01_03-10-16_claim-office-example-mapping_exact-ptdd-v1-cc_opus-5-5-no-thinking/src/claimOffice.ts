import { openPolicy, settleClaim, type Damage, type Policy } from "./claims.js";
import { quotePremium, type Customer } from "./premium.js";
import type { Item } from "./priceList.js";

export type { Item } from "./priceList.js";
export type { Damage } from "./claims.js";

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): Result[] {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, index) => {
    if (step.op === "claim") return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer, previousContracts);
    previousContracts += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  });
}
