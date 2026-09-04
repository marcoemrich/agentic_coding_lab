import { isKnownItemType, type Item } from './premium.js';
import { quotePremium, type Customer } from './quote.js';
import { createPolicy, type Policy } from './policy.js';
import { settleClaim } from './claim.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

function runQuote(
  step: QuoteStep,
  customer: Customer,
  previousContracts: number,
): { result: StepResult; policy: Policy } {
  for (const item of step.items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }

  return {
    result: { premium: quotePremium(step.items, customer, previousContracts) },
    policy: createPolicy(step.items),
  };
}

function runClaim(step: ClaimStep, policies: Map<number, Policy>): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`step ${step.policy} did not create a policy`);
  }

  return settleClaim(policy, step.incident.damages);
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const { result, policy } = runQuote(step, scenario.customer, contracts);
      policies.set(index, policy);
      contracts += 1;
      results.push(result);
    } else {
      results.push(runClaim(step, policies));
    }
  });

  return results;
}
