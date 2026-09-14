import { Customer, Item, quotePremium } from './premium.js';
import { ClaimResult, Damage, Policy } from './policy.js';
import { ClaimError } from './errors.js';

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

export interface QuoteResult {
  premium: number;
}

export type StepResult = QuoteResult | ClaimResult;

/**
 * Processes the steps of a scenario in order. Each quote creates a policy that
 * later claims address by the quote's step index; the policy keeps its
 * remaining cap across claims.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, policies.size);
      policies.set(index, new Policy(step.items));
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimError(`no policy created by step ${step.policy}`);
    }
    results.push(policy.claim(step.incident.damages));
  });

  return results;
}
