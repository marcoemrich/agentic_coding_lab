import { premium } from './premium.js';
import type { Item } from './item.js';
import { claim } from './claim.js';
import type { Damage } from './damage.js';
import { createPolicy, type Policy } from './policy.js';
type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
export function processScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') return claim(policies.get(step.policy)!, step.incident.damages);
    policies.set(index, createPolicy(step.items));
    return { premium: premium(step.items, scenario.customer.yearsWithMHPCO, previousContracts++) };
  });
  return { results };
}
