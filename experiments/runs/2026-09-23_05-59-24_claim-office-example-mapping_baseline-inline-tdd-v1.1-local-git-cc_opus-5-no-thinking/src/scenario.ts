import { Customer, Item, isKnownType, quotePremium } from './premium.js';
import { cap } from './policy.js';
import { ClaimError, Incident, settleClaim } from './claim.js';

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

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function assertKnownTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new ClaimError(`unknown item type "${item.type}"`);
    }
  }
}

/**
 * Steps are processed in order: each quote opens a policy that later
 * claim steps address by its step index, and claims draw down that
 * policy's remaining cap.
 */
export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      assertKnownTypes(step.items);
      const premium = quotePremium(step.items, scenario.customer, policies.size);
      policies.set(index, { items: step.items, remainingCap: cap(step.items) });
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimError(`step ${step.policy} did not create a policy`);
    }
    const settlement = settleClaim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  });
  return { results };
}
