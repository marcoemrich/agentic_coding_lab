import { processClaim } from './claims.js';
import { computePremium, totalInsuranceSum } from './pricing.js';
import { ClaimStep, Policy, QuoteStep, Scenario, ScenarioResult, StepResult } from './types.js';

/**
 * Run a full scenario: a customer plus a sequence of quote/claim steps.
 * Quote steps allocate a new Policy stored by their step index; claim
 * steps reference an earlier quote step's policy.
 */
export function runScenario(scenario: Scenario): ScenarioResult {
  const policiesByStep = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const q = step as QuoteStep;
      const premium = computePremium(q.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      const insuranceSum = totalInsuranceSum(q.items);
      const cap = 2 * insuranceSum;
      policiesByStep.set(idx, {
        items: q.items,
        insuranceSum,
        cap,
        remainingCap: cap,
      });
      results.push({ premium });
      contractIndex += 1;
    } else {
      const c = step as ClaimStep;
      const policy = policiesByStep.get(c.policy);
      if (!policy) {
        throw new Error(`Claim at step ${idx} references unknown policy ${c.policy}`);
      }
      const outcome = processClaim(policy, c.incident);
      results.push(outcome);
    }
  });

  return { results };
}
