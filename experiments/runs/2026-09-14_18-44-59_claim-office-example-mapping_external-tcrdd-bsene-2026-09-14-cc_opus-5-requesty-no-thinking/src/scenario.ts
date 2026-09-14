import { quote, type Customer, type Item } from './quote';
import { insuranceSum } from './policy';
import { settleClaim, type Damage, type Policy } from './claim';

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

export interface ClaimResultOutput {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResultOutput;

const CAP_FACTOR = 2;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer, contractCount) });
      contractCount += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_FACTOR,
      });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    const result = settleClaim(policy, step.incident.damages);
    policy.remainingCap = result.remainingCap;
    results.push(result);
  });

  return { results };
}
