import { processClaim } from './claims.js';
import { computeInsuranceSum, computePremium } from './pricing.js';
import type {
  Policy,
  Scenario,
  ScenarioOutput,
  Step,
  StepResult,
} from './types.js';

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let contractsIssued = 0;

  scenario.steps.forEach((step: Step, index: number) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractsAlreadyIssued: contractsIssued,
      });
      const insuranceSum = computeInsuranceSum(step.items);
      const policy: Policy = {
        items: step.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      };
      policies.set(index, policy);
      contractsIssued += 1;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(
          `Claim refers to unknown policy index ${step.policy} at step ${index}`,
        );
      }
      const outcome = processClaim(policy, step.incident);
      results.push(outcome);
    } else {
      throw new Error(`Unknown op at step ${index}`);
    }
  });

  return { results };
}
