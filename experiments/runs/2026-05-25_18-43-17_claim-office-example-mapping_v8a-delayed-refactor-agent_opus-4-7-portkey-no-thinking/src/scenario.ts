import { Scenario, ScenarioResult, StepResult, Policy, Step } from './types.js';
import { computePremium } from './premium.js';
import { makePolicy } from './policy.js';
import { processClaim } from './claim.js';

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step: Step, stepIndex: number) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, {
        customer: scenario.customer,
        quoteIndex: quoteCount,
      });
      policies.set(stepIndex, makePolicy(step.items));
      quoteCount += 1;
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(
        `Claim step ${stepIndex} references non-existent policy ${step.policy}`
      );
    }
    results.push(processClaim(policy, step.incident));
  });

  return { results };
}
