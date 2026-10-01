import { openPolicy, type Policy, settleClaim } from "./claim.js";
import { quotePremium } from "./premium.js";

export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
export type Result = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy) ?? openPolicy([]), step.incident.damages);
    }
    const customer = { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, previousContracts };
    previousContracts += 1;
    policies.set(index, openPolicy(step.items));
    return { premium: quotePremium(step.items, customer) };
  });
  return { results };
}
