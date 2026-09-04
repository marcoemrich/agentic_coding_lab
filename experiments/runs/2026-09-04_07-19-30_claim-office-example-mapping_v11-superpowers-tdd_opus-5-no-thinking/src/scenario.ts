import { type Incident, claim } from './claim.js';
import { insuranceSum } from './policy.js';
import { type Customer, type Item, quote } from './quote.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
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

const CAP_FACTOR = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const { premium } = quote(scenario.customer, step.items, policies.size);
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_FACTOR,
      });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`step ${index} refers to unknown policy ${step.policy}`);
    }
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    results.push(result);
  });

  return { results };
}
