import { computeQuote, computeInsuranceSum } from './quote.js';
import { processClaim } from './claim.js';
import { isKnownItem } from './pricing.js';
import type { Item, Customer } from './quote.js';
import type { Policy } from './claim.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResultOutput {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResultOutput;

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  // Map from step index to policy for quote steps
  const policyByStepIndex = new Map<number, Policy>();
  let quoteCount = 0;

  for (let stepIdx = 0; stepIdx < scenario.steps.length; stepIdx++) {
    const step = scenario.steps[stepIdx];
    if (step.op === 'quote') {
      // Validate items
      for (const item of step.items) {
        if (!isKnownItem(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }

      const premium = computeQuote(scenario.customer, step.items, quoteCount);
      const insuranceSum = computeInsuranceSum(step.items);
      const policy: Policy = {
        items: step.items,
        insuranceSum,
        cap: insuranceSum * 2,
        totalPaidOut: 0,
      };
      policyByStepIndex.set(stepIdx, policy);
      quoteCount++;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const refIndex = step.policy;
      const policy = policyByStepIndex.get(refIndex);
      if (!policy) {
        throw new Error(`Invalid policy reference: ${refIndex} (step ${refIndex} is not a quote)`);
      }

      const claimResult = processClaim(policy, step.incident.damages);
      policy.totalPaidOut += claimResult.payout;
      results.push({
        payout: claimResult.payout,
        remainingCap: claimResult.remainingCap,
      });
    }
  }

  return results;
}
