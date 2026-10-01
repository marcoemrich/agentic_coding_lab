import { openPolicy, settleClaim, type ClaimResult, type Damage, type OpenPolicy } from './claim';
import { quote, type Customer, type Item } from './quote';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
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

export interface ScenarioResult {
  results: StepResult[];
}

/**
 * Processes the steps in order. Quote steps open a policy that later claim
 * steps address by step index; the follow-up discount applies from the
 * customer's second quote on.
 */
export function runScenario(scenario: Scenario): ScenarioResult {
  const policiesByStep = new Map<number, OpenPolicy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const policy = quote(scenario.customer, step.items, policiesByStep.size);
      policiesByStep.set(index, openPolicy(policy));
      results.push({ premium: policy.premium });
      return;
    }

    const policy = policiesByStep.get(step.policy);
    if (!policy) {
      throw new Error(`step ${step.policy} did not create a policy`);
    }
    results.push(settleClaim(policy, step.incident.damages));
  });

  return { results };
}
