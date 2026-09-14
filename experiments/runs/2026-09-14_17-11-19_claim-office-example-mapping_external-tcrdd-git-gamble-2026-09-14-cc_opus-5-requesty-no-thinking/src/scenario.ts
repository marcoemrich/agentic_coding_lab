import type { Customer, Item } from './premium.js';
import { quotePremium } from './premium.js';
import type { Incident } from './claim.js';
import { capOf, settleClaim } from './claim.js';

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

export interface QuoteResult {
  premium: number;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResults {
  results: (QuoteResult | ClaimStepResult)[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  const results: (QuoteResult | ClaimStepResult)[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contractIndex);
      contractIndex += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: capOf({ items: step.items }),
      });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    const result = settleClaim(policy, step.incident);
    policy.remainingCap = result.remainingCap;
    results.push(result);
  });

  return { results };
}
