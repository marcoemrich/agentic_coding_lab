import { computePremium } from './premium.js';
import { createPolicy, processClaim, Policy } from './claim.js';
import {
  Scenario,
  ScenarioResults,
  StepResult,
  Item,
} from './types.js';

interface PolicyRecord {
  policy: Policy;
  items: Item[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const results: StepResult[] = [];
  const policies: (PolicyRecord | null)[] = [];
  let priorContracts = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const premium = computePremium(scenario.customer, step.items, priorContracts);
      const policy = createPolicy(step.items);
      policies[i] = { policy, items: step.items };
      results.push({ premium });
      priorContracts += 1;
    } else if (step.op === 'claim') {
      // Validate referenced policy
      if (step.policy < 0 || step.policy >= scenario.steps.length) {
        throw new Error(`Invalid policy index: ${step.policy}`);
      }
      const rec = policies[step.policy];
      if (!rec) {
        throw new Error(`Policy at step ${step.policy} not found (not a quote)`);
      }
      // Push a placeholder; processClaim mutates the policy's remainingCap
      const outcome = processClaim(rec.policy, rec.items, step.incident);
      // Ensure remainingCap reflects the policy's state after the claim
      policies[i] = null;
      results.push({ payout: outcome.payout, remainingCap: outcome.remainingCap });
    } else {
      throw new Error(`Unknown op: ${(step as { op?: string }).op}`);
    }
  }

  return { results };
}
