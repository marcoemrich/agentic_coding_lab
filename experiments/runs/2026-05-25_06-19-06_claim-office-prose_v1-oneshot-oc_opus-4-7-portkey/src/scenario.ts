import {
  Scenario,
  ScenarioOutput,
  StepResult,
  QuoteStep,
  ClaimStep,
} from './types.js';
import { quotePremium } from './pricing.js';
import { createPolicyState, processClaim, PolicyState } from './claims.js';

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policiesByStep = new Map<number, PolicyState>();
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const qs = step as QuoteStep;
      const premium = quotePremium(qs.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      policiesByStep.set(idx, createPolicyState(qs.items));
      contractIndex += 1;
      results.push({ premium });
    } else {
      const cs = step as ClaimStep;
      const policy = policiesByStep.get(cs.policy);
      if (!policy) {
        throw new Error(`Claim at step ${idx} references missing policy at step ${cs.policy}`);
      }
      const outcome = processClaim(policy, cs.incident);
      results.push(outcome);
    }
  });

  return { results };
}
