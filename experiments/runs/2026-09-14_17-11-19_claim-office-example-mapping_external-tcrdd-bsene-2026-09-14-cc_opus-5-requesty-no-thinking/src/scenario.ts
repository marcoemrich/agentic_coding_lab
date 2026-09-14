import { quote, type Customer, type Item } from './quote.js';
import { settleClaim, type ClaimResult, type Damage, type Policy } from './claim.js';

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

export interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: (QuoteResult | ClaimResult)[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer, contractIndex) });
      policies.set(index, { items: step.items });
      contractIndex += 1;
      continue;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    results.push(settleClaim(policy, step.incident.damages));
  }
  return { results };
}
