import { createPolicy, settleClaim, type Damage, type Policy } from './claim';
import { quotePremium, type Customer, type Item } from './premium';

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

export interface ScenarioResult {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(scenario.customer, step.items, quotesSoFar);
      quotesSoFar += 1;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`no policy created by step ${step.policy}`);
    return settleClaim(policy, step.incident.damages);
  });

  return { results };
}
