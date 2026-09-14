import { Item } from './pricing.js';
import { Customer, quotePremium } from './premium.js';
import { Incident, Policy, openPolicy, settleClaim } from './claim.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  /** Zero-based index of the quote step that created the policy. */
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

export type StepResult = QuoteResult | { payout: number; remainingCap: number };

/**
 * Processes the steps of a scenario in order, returning one result per step.
 * Policies created by quote steps stay addressable by their step index, so
 * later claims settle against the same - progressively exhausted - policy.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(scenario.customer, step.items, contracts);
      contracts += 1;
      policies.set(index, openPolicy(step.items));
      return { premium };
    }

    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy created by step ${step.policy}`);
      }
      return settleClaim(policy, step.incident);
    }

    throw new Error(`Unknown operation: ${(step as { op: string }).op}`);
  });
}
