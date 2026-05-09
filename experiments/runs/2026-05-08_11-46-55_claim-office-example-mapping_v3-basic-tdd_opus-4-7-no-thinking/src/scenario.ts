import { Item, Customer, Incident, isKnownItem } from './types.js';
import { computePremium } from './premium.js';
import { createPolicy, processClaim, Policy } from './claim.js';

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

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export interface ScenarioOutput {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const customer = scenario.customer;
  const results: StepResult[] = [];
  // Track policies by step index
  const policiesByIndex: Record<number, Policy> = {};
  // Track contracts so far
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      // Validate items
      for (const it of step.items) {
        if (!isKnownItem(it.type)) {
          throw new Error(`Unknown item type: ${it.type}`);
        }
      }
      const premium = computePremium(step.items, customer, contractIndex);
      const policy = createPolicy(step.items);
      policiesByIndex[i] = policy;
      results.push({ premium });
      contractIndex += 1;
    } else if (step.op === 'claim') {
      const policy = policiesByIndex[step.policy];
      if (!policy) {
        throw new Error(`Claim references missing policy: ${step.policy}`);
      }
      const r = processClaim(policy, step.incident);
      results.push({ payout: r.payout, remainingCap: r.remainingCap });
    } else {
      throw new Error(`Unknown step op: ${(step as { op: string }).op}`);
    }
  }

  return { results };
}
