import { Customer, Item, premiumFor } from './premium';
import { ClaimResult, Damage, Policy } from './claim';

export type { Item, Damage, ClaimResult };

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
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

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'quote') {
        const premium = premiumFor(step.items, scenario.customer, policies.size > 0);
        policies.set(index, new Policy(step.items));
        return { premium };
      }
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step ${step.policy}`);
      }
      return policy.claim(step.incident.damages);
    }),
  };
}
