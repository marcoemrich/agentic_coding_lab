import { quote, type Customer, type Item } from './quote.js';
import { computePayout, type Incident } from './claim.js';

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

export interface QuoteResult { premium: number; }
export interface ClaimResult { payout: number; }
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput { results: StepResult[]; }

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Item[]>();
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const premium = quote(scenario.customer, step.items, { contractIndex });
      policies.set(idx, step.items);
      contractIndex += 1;
      results.push({ premium });
    } else {
      const items = policies.get(step.policy) ?? [];
      const payout = computePayout(items, step.incident);
      results.push({ payout });
    }
  });

  return { results };
}
