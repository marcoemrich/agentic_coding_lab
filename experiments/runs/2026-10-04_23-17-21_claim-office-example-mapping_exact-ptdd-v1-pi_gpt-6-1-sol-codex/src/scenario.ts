import { quotePremium, type Item } from './premium.js';
import { processClaim } from './claims.js';
import { createPolicy, type Policy } from './policy.js';

export type QuoteStep = { op: 'quote'; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };

export function processScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      return processClaim(policies.get(step.policy)!, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, policies.size);
    policies.set(index, createPolicy(step.items));
    return { premium };
  }) };
}
