import {
  quotePremium,
  insuranceValueOf,
  UnknownItemTypeError,
  type Customer,
  type Item,
} from './premium';
import { settleClaim, ClaimError, type Incident, type Policy } from './claim';

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

export interface ClaimResultOutput {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResultOutput;

export class ScenarioError extends Error {}

const CAP_FACTOR = 2;

function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_FACTOR };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    try {
      if (step.op === 'quote') {
        const premium = quotePremium(step.items, scenario.customer, policies.size);
        policies.set(index, openPolicy(step.items));
        results.push({ premium });
        return;
      }

      const policy = policies.get(step.policy);
      if (!policy) {
        throw new ScenarioError(`Step ${step.policy} did not create a policy`);
      }
      const { payout, remainingCap } = settleClaim(policy, step.incident);
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    } catch (error) {
      if (error instanceof UnknownItemTypeError || error instanceof ClaimError) {
        throw new ScenarioError(`Step ${index}: ${error.message}`);
      }
      throw error;
    }
  });

  return results;
}
