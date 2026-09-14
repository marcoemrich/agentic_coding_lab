import { ClaimError, ClaimResult, Damage, Policy, PolicyState, settleClaim } from './claim.js';
import { Customer, quotePremium } from './premium.js';
import { Item } from './pricing.js';

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

export type StepResult = { premium: number } | ClaimResult;

/**
 * Runs the steps of a scenario in order, returning one result per step.
 *
 * Policies are keyed by the index of the quote step that created them, which
 * is what a later claim step's `policy` field refers to. A policy's remaining
 * cap persists across the claims that follow it.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, PolicyState>();
  let quotesSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, quotesSoFar);
      quotesSoFar += 1;
      policies.set(index, Policy(step.items));
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimError(
        `claim refers to step ${step.policy}, which created no policy`,
      );
    }
    return settleClaim(policy, step.incident.damages);
  });
}
