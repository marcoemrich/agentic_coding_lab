import { processClaim, type Damage } from './claim.js';
import { payoutCap } from './policy.js';
import type { Item } from './premium.js';
import { quotePremium, type Customer } from './quote.js';

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

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      const premium = quotePremium({
        items: step.items,
        customer: scenario.customer,
        previousContracts: policies.size,
      });
      policies.set(index, { items: step.items, remainingCap: payoutCap(step.items) });
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`claim references no policy at step index ${step.policy}`);
      }
      const result = processClaim({
        items: policy.items,
        damages: step.incident.damages,
        remainingCap: policy.remainingCap,
      });
      policy.remainingCap = result.remainingCap;
      results.push(result);
    }
  }

  return results;
}
