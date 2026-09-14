import { quotePremium, type Customer, type Item } from './premium.js';
import { Policy, ClaimRejectedError, type Incident, type ClaimResult } from './policy.js';

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

export interface QuoteResult {
  premium: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

export class ScenarioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioError';
  }
}

/**
 * Runs the steps of a scenario in order. Quote steps create a policy that
 * later claim steps address by step index; the contract count advances on
 * quote steps only, since only a quote forms a contract.
 */
export function runScenario(scenario: Scenario): ScenarioOutput {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(scenario.customer, step.items, contractIndex);
      contractIndex += 1;
      policies.set(index, new Policy(step.items));
      results.push({ premium });
      return;
    }

    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new ScenarioError(`step ${step.policy} did not create a policy`);
      }
      results.push(policy.claim(step.incident));
      return;
    }

    throw new ScenarioError(`unknown operation: ${(step as { op: string }).op}`);
  });

  return { results };
}

export { ClaimRejectedError };
