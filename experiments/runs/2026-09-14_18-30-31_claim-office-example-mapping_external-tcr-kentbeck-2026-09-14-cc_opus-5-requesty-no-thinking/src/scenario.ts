import { ClaimError, Damage, Policy } from './claim.js';
import { Customer, Item, quotePremium } from './premium.js';

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

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let quotesSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, quotesSoFar > 0);
      quotesSoFar += 1;
      policies.set(index, new Policy(step.items));
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new ClaimError(`No policy created by step ${step.policy}`);
      }
      results.push(policy.claim(step.incident.damages));
    }
  });

  return results;
}
