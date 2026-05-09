import { Customer, Item, Incident } from './types.js';
import { quotePremium } from './premium.js';
import { processClaim, makePolicy, Policy } from './claim.js';
import { isKnownItemType } from './premium.js';

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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  // Map of step index -> Policy (only for quote steps)
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      // Validate items
      for (const item of step.items) {
        if (!isKnownItemType(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const contractIndex = quoteCount;
      const premium = quotePremium(scenario.customer, step.items, contractIndex);
      const policy = makePolicy(step.items);
      policies.set(i, policy);
      results.push({ premium });
      quoteCount++;
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy at step ${step.policy}`);
      }
      // Validate damage item types (known)
      for (const d of step.incident.damages) {
        if (!isKnownItemType(d.itemType)) {
          throw new Error(`Unknown damage item type: ${d.itemType}`);
        }
      }
      const r = processClaim(policy, step.incident);
      results.push(r);
    } else {
      throw new Error(`Unknown step op: ${(step as { op: string }).op}`);
    }
  }
  return { results };
}
