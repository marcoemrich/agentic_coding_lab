import { computePremium, type Customer, type Item } from './premium';
import { Policy, InvalidClaimError, type Incident } from './claim';

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
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export class ScenarioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioError';
  }
}

/**
 * Run a scenario's steps sequentially and return the per-step results.
 *
 * - Each `quote` step computes a premium. The number of prior `quote` steps
 *   determines whether the follow-up-contract discount applies.
 * - Each `claim` step references a policy created by an earlier `quote` step
 *   via its zero-based step index and mutates that policy's remaining cap.
 */
function validateScenario(scenario: Scenario): void {
  if (!scenario || typeof scenario !== 'object') {
    throw new ScenarioError('Scenario must be an object');
  }
  if (!scenario.customer || typeof scenario.customer.yearsWithMHPCO !== 'number') {
    throw new ScenarioError('Scenario customer.yearsWithMHPCO is required');
  }
  if (!Array.isArray(scenario.steps)) {
    throw new ScenarioError('Scenario steps must be an array');
  }
}

export function runScenario(scenario: Scenario): StepResult[] {
  validateScenario(scenario);

  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let priorContracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, {
        customer: scenario.customer,
        priorContracts,
      });
      priorContracts += 1;
      policies.set(index, new Policy(step.items));
      results.push({ premium });
    } else if (step.op === 'claim') {
      results.push(processClaimStep(policies, step, index));
    } else {
      throw new ScenarioError(
        `Unknown op at step ${index}: ${(step as { op: string }).op}`,
      );
    }
  });

  return results;
}

function processClaimStep(
  policies: Map<number, Policy>,
  step: ClaimStep,
  index: number,
): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new ScenarioError(
      `Claim step ${index} references unknown policy ${step.policy}`,
    );
  }
  return policy.processClaim(step.incident);
}

export { InvalidClaimError };
