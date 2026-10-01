import { quotePremium, type Customer, type Item } from './premium.js';
import { createPolicy, processClaim, type ClaimResult, type Incident, type Policy } from './claim.js';

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

export interface ScenarioOutput {
  results: (QuoteResult | ClaimResult)[];
}

/**
 * Processes the steps in order. Each quote creates a policy that later claim
 * steps address by its step index; every quote after the first counts as a
 * follow-up contract for the single customer of the scenario.
 */
export function runScenario(scenario: Scenario): ScenarioOutput {
  const { customer, steps } = scenario;
  const policies = new Map<number, Policy>();
  const results: (QuoteResult | ClaimResult)[] = [];
  let contractCount = 0;

  steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(customer, step.items, contractCount);
      contractCount += 1;
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Claim references step ${step.policy}, which created no policy`);
    }
    results.push(processClaim(policy, step.incident));
  });

  return { results };
}
