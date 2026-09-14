import { quote, type Customer, type Item } from './quote';
import { Policy, type ClaimResult, type Damage } from './policy';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface Incident {
  cause: string;
  damages: Damage[];
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

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer, contractIndex) });
      policies.set(stepIndex, new Policy(step.items));
      contractIndex += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    results.push(policy.claim(step.incident.damages));
  });
  return results;
}
