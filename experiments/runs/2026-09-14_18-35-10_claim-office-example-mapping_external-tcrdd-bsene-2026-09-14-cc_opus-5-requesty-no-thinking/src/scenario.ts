import { quote, type Customer, type Item } from './quote';
import { createPolicy, type Policy } from './policy';
import { claim, type ClaimResult, type Incident } from './claim';

export type QuoteStep = {
  op: 'quote';
  items: Item[];
};

export type ClaimStep = {
  op: 'claim';
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = {
  premium: number;
};

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioOutput = {
  results: StepResult[];
};

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer, contracts) });
      policies.set(index, createPolicy(step.items));
      contracts += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    results.push(claim(policy, step.incident));
  });
  return { results };
}
