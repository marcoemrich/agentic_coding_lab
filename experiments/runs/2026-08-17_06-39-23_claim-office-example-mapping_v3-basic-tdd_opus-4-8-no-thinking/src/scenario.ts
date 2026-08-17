import { Policy } from './claim.js';
import { computePremium } from './premium.js';
import type {
  ScenarioResult,
  Scenario,
  StepResult,
} from './types.js';

export class ScenarioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioError';
  }
}

/**
 * Process a scenario's steps sequentially. Quote steps create policies (indexed
 * by their step index) and produce a premium; claim steps refer to an earlier
 * quote's policy by index and produce a payout and the remaining cap.
 */
export function runScenario(scenario: Scenario): ScenarioResult {
  const { customer, steps } = scenario;
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let quoteCount = 0;

  steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const contractIndex = quoteCount;
      quoteCount += 1;
      const premium = computePremium(step.items, customer, contractIndex);
      policies.set(index, new Policy(step.items));
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new ScenarioError(
          `Claim references step ${step.policy}, which is not a quote`,
        );
      }
      results.push(policy.claim(step.incident));
    } else {
      throw new ScenarioError(
        `Unknown step operation: ${(step as { op: string }).op}`,
      );
    }
  });

  return { results };
}
