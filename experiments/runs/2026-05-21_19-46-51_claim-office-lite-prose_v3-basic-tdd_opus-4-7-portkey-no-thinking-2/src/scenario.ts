import { quote, type Customer, type Item } from './quote.js';
import { claim, type Incident } from './claim.js';

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

type Result = { premium: number } | { payout: number };

export interface ScenarioOutput {
  results: Result[];
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: Result[] = new Array(scenario.steps.length);
  const policyItemsByStep: Record<number, Item[]> = {};
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const premium = quote(scenario.customer, step.items, { contractIndex });
      results[i] = { premium };
      policyItemsByStep[i] = step.items;
      contractIndex++;
    } else {
      const items = policyItemsByStep[step.policy] ?? [];
      const payout = claim(items, step.incident);
      results[i] = { payout };
    }
  }

  return { results };
}
