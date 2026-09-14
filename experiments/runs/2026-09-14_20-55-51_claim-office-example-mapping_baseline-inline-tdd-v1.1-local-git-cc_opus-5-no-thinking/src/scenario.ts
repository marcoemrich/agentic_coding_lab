import { computePremium, insuranceSum } from './premium.js';
import type { Customer, QuoteItem } from './premium.js';
import { computeClaim, ClaimError } from './claim.js';
import type { Incident } from './claim.js';
import { CAP_FACTOR } from './domain.js';

export interface QuoteStep {
  op: 'quote';
  items: QuoteItem[];
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

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let quotesSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, scenario.customer, quotesSoFar > 0);
      quotesSoFar += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_FACTOR,
      });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimError(`Claim refers to step ${step.policy}, which is not a policy`);
    }
    const outcome = computeClaim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = outcome.remainingCap;
    results.push(outcome);
  });

  return results;
}
