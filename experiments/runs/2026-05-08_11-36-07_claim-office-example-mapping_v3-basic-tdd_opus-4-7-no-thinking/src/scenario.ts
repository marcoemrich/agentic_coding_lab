import { Policy, createPolicy, processClaim } from './claim.js';
import { computePremium } from './premium.js';
import { Scenario, ScenarioResult, StepResult } from './types.js';

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policiesByStep: Map<number, Policy> = new Map();
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const isFollowUp = quoteCount > 0;
      const premium = computePremium({
        items: step.items,
        customer: scenario.customer,
        isFollowUp,
      });
      // Create policy for later claim references
      const policy = createPolicy(step.items);
      policiesByStep.set(i, policy);
      results.push({ premium });
      quoteCount += 1;
    } else if (step.op === 'claim') {
      const policy = policiesByStep.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      const out = processClaim(policy, step.incident);
      results.push(out);
    } else {
      throw new Error(`Unknown step op: ${(step as any).op}`);
    }
  }

  return { results };
}
