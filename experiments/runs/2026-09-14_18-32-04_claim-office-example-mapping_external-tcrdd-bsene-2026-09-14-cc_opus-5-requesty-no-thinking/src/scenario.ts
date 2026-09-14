import { quote, type Customer, type Item } from './quote.js';
import { Policy, type ClaimResult, type Incident } from './policy.js';

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

export type Result = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer, contractIndex) });
      policies.set(index, new Policy(step.items));
      contractIndex += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    results.push(policy.claim(step.incident));
  });
  return { results };
}
