import { Item, isKnownItemType } from './pricing.js';
import { computeQuote } from './quote.js';
import { computeClaim, Damage } from './claim.js';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number };

export interface ScenarioOutput {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const quoteByIndex = new Map<number, QuoteStep>();
  let quoteCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!isKnownItemType(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const premium = computeQuote({
        items: step.items,
        yearsWithMHPCO: customer.yearsWithMHPCO,
        isFirstContract: quoteCount === 0,
      });
      results.push({ premium });
      quoteByIndex.set(i, step);
      quoteCount++;
    } else if (step.op === 'claim') {
      const policyStep = quoteByIndex.get(step.policy);
      if (!policyStep) {
        throw new Error(`Claim references non-quote or missing step index ${step.policy}`);
      }
      const payout = computeClaim({
        policyItems: policyStep.items,
        damages: step.incident.damages,
      });
      results.push({ payout });
    } else {
      throw new Error(`Unknown op in step ${i}`);
    }
  }

  return { results };
}
