import { claimPayout } from './claim.js';
import { initialPolicyCap, settlePolicyClaim } from './policy.js';
import { quotePremium } from './premium.js';
import type { Item } from './item.js';
type Step = { op: 'quote'; items: Item[] } | {
  op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] };
};
type InsuredPolicy = { items: Item[]; remainingCap: number };

export function processScenario(scenario: { customer: { yearsWithMHPCO: number }; steps: Step[] }) {
  const policies = new Map<number, InsuredPolicy>();
  let previousContracts = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      policies.set(index, { items: step.items, remainingCap: initialPolicyCap(step.items) });
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
      previousContracts += 1;
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    const requestedPayout = claimPayout(policy.items, step.incident.damages);
    const settlement = settlePolicyClaim(policy.remainingCap, requestedPayout);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  });
}
