import { calculatePremium } from './premium.js';
import { processClaim, computeInsuranceSum, Policy } from './claim.js';
import { Item, Incident } from './types.js';

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
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResultOut {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResultOut;

export interface ScenarioResult {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const items = step.items;
      const premium = calculatePremium(
        { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, contractIndex },
        items
      );
      const insuranceSum = computeInsuranceSum(items);
      policies[idx] = {
        items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      };
      contractIndex += 1;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy at step ${step.policy} not found`);
      }
      const r = processClaim(policy, step.incident);
      results.push({ payout: r.payout, remainingCap: r.remainingCap });
    } else {
      throw new Error(`Unknown step op: ${(step as any).op}`);
    }
  });

  return { results };
}
