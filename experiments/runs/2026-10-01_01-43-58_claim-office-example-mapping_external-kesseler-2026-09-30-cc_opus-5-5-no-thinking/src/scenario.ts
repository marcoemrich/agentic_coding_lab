import { ClaimResult, Damage, Policy } from './policy';
import { Customer, Item, quotePremium } from './premium';

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

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      const followUp = policies.size > 0;
      policies.set(index, new Policy(step.items));
      return { premium: quotePremium(step.items, scenario.customer, followUp) };
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`No policy was created by step ${step.policy}`);
    }
    return policy.claim(step.incident.damages);
  });
  return { results };
}
