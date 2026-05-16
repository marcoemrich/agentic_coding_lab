import { processClaim } from './claims.js';
import { computePremium } from './pricing.js';
import { totalInsuranceSum } from './pricing.js';
import {
  ClaimStep,
  Output,
  Policy,
  QuoteStep,
  Scenario,
  StepResult,
} from './types.js';

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const q = step as QuoteStep;
      const premium = computePremium(q.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      const insSum = totalInsuranceSum(q.items);
      policies[idx] = {
        items: q.items,
        insuranceSum: insSum,
        remainingCap: 2 * insSum,
      };
      results.push({ premium });
      contractIndex += 1;
    } else {
      const c = step as ClaimStep;
      const pol = policies[c.policy];
      if (!pol) throw new Error(`No policy at step index ${c.policy}`);
      const { payout, remainingCap } = processClaim(pol, c.incident);
      results.push({ payout, remainingCap });
    }
  });

  return { results };
}
