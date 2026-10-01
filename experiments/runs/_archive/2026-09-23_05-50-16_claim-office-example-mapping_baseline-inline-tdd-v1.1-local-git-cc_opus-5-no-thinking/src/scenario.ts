import { Customer, Item, quote } from './quote.js';
import { ClaimResult, Damage } from './claim.js';
import { Policy } from './policy.js';

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

export class ScenarioError extends Error {}

/**
 * Steps are processed sequentially: each quote creates a policy that later
 * claim steps reference by the quote's zero-based step index.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const { premium } = quote(scenario.customer, step.items, contractsSoFar);
      contractsSoFar += 1;
      policies.set(index, new Policy(step.items));
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ScenarioError(`step ${step.policy} did not create a policy`);
    }
    return policy.claim(step.incident.damages);
  });
}
