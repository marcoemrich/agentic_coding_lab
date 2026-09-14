import { Item } from './premium.js';
import { Customer, quotePremium } from './quote.js';
import { Damage, Policy } from './policy.js';

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

export function runScenario(scenario: Scenario): Result[] {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quotePremium(step.items, scenario.customer, contractIndex) });
      policies.set(index, new Policy(step.items));
      contractIndex += 1;
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`no policy created by step ${step.policy}`);
      }
      results.push(policy.claim(step.incident.damages));
    } else {
      throw new Error(`unknown operation: ${JSON.stringify((step as { op: unknown }).op)}`);
    }
  });

  return results;
}
