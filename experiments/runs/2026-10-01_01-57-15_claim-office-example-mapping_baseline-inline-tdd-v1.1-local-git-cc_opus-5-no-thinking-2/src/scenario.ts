import { itemSpec } from './items.js';
import { damagePayout } from './claim.js';
import { cap } from './policy.js';
import { Item } from './premium.js';
import { roundPayout } from './rounding.js';
import { Customer, quotePremium } from './quote.js';

export class ScenarioError extends Error {}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let contractCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: handleQuote(step, scenario.customer, contractCount) });
      policies.set(index, { items: step.items, remainingCap: cap(step.items) });
      contractCount += 1;
    } else {
      results.push(handleClaim(step, policies));
    }
  });

  return { results };
}

function handleQuote(step: QuoteStep, customer: Customer, previousContracts: number): number {
  for (const item of step.items) {
    if (!itemSpec(item.type)) {
      throw new ScenarioError(`unknown item type: ${item.type}`);
    }
  }
  return quotePremium(step.items, customer, previousContracts);
}

function handleClaim(step: ClaimStep, policies: Map<number, Policy>): Result {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new ScenarioError(`step ${step.policy} did not create a policy`);
  }

  // Each damage entry consumes one insured item of that type, so that a policy
  // covering one sword cannot absorb two sword damages.
  const available = [...policy.items];
  let desired = 0;

  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new ScenarioError(`negative damage amount: ${damage.amount}`);
    }
    const at = available.findIndex((i) => i.type === damage.itemType);
    if (at === -1) {
      throw new ScenarioError(`item not covered by the policy: ${damage.itemType}`);
    }
    const [item] = available.splice(at, 1);
    desired += damagePayout(item, damage.amount);
  }

  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
