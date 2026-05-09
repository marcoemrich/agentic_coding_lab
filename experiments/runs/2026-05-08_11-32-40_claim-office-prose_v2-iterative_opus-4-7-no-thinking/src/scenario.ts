import {
  Scenario,
  ScenarioOutput,
  StepResult,
  Policy,
  QuoteStep,
  ClaimStep,
} from './types.js';
import { computePremium, totalInsuranceSum } from './pricing.js';
import { processClaim } from './claim.js';

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let contractCount = 0; // number of quotes (contracts) issued so far

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const quoteStep = step as QuoteStep;
      const isFirstContract = contractCount === 0;
      const premium = computePremium(quoteStep.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFirstContract,
      });
      const insuranceSum = totalInsuranceSum(quoteStep.items);
      policies.set(i, {
        items: quoteStep.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      });
      contractCount++;
      results.push({ premium });
    } else {
      const claimStep = step as ClaimStep;
      const policy = policies.get(claimStep.policy);
      if (!policy) {
        throw new Error(
          `Claim step ${i} refers to unknown policy index ${claimStep.policy}`,
        );
      }
      const outcome = processClaim(policy, claimStep.incident);
      results.push(outcome);
    }
  }

  return { results };
}
