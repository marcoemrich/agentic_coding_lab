import { claimPayout, type Damage } from './claims.js';
import { insuranceCap } from './coverage.js';
import type { Item } from './item-prices.js';
import { quotePremium } from './premiums.js';

type QuoteStep = { op: 'quote'; items: Item[] };
type ClaimStep = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

export function processScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  let quotes = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quotes);
      policies.set(index, { items: step.items, remainingCap: insuranceCap(step.items) });
      quotes += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    const payout = claimPayout(policy.items, step.incident.damages, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
