import { Customer, Item } from './catalog.js';
import { ClaimError, Damage, Policy, openPolicy } from './policy.js';
import { quotePremium } from './premium.js';

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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

/**
 * Run every step in order. Quotes open a policy that later claims refer to by
 * the quote's step index; each quote after the customer's first receives the
 * follow-up discount.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policiesByStep = new Map<number, Policy>();
  const results: StepResult[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(scenario.customer, quoteCount, step.items);
      quoteCount += 1;
      policiesByStep.set(index, openPolicy(step.items));
      results.push({ premium });
      return;
    }

    const policy = policiesByStep.get(step.policy);
    if (!policy) {
      throw new ClaimError(
        `Claim in step ${index} refers to step ${step.policy}, which did not create a policy`,
      );
    }
    results.push(policy.claim(step.incident.damages));
  });

  return results;
}
