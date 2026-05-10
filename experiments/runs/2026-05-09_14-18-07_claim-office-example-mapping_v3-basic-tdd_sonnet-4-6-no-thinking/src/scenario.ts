import { computePremium, QuoteItem, Customer } from './quote.js';
import { processClaim, Policy, DamageEntry } from './claim.js';
import { getInsuranceValue, COMPONENT_ITEM_TYPES, MAIN_ITEM_TYPES } from './items.js';

interface QuoteStep {
  op: 'quote';
  items: QuoteItem[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

type Step = QuoteStep | ClaimStep;

interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface ScenarioOutput {
  results: StepResult[];
}

export function runScenario(input: ScenarioInput): ScenarioOutput {
  const customer: Customer = { yearsWithMHPCO: input.customer.yearsWithMHPCO };
  const policies: Policy[] = [];
  const results: StepResult[] = [];

  let quoteCount = 0;

  for (const step of input.steps) {
    if (step.op === 'quote') {
      const isFirstContract = quoteCount === 0;
      const premium = computePremium(step.items, customer, { isFirstContract });

      // Build policy from the items
      const insuranceSum = computeInsuranceSum(step.items);
      const policy: Policy = {
        items: step.items.map(i => ({ type: i.type })),
        insuranceSum,
        cap: insuranceSum * 2,
        remainingCap: insuranceSum * 2,
      };

      policies.push(policy);
      results.push({ premium });
      quoteCount++;
    } else if (step.op === 'claim') {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy at index ${step.policy} not found`);
      }
      const claimResult = processClaim(policy, step.incident.damages);
      results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
    }
  }

  return { results };
}

function computeInsuranceSum(items: QuoteItem[]): number {
  let sum = 0;
  for (const item of items) {
    if (MAIN_ITEM_TYPES.has(item.type) || COMPONENT_ITEM_TYPES.has(item.type)) {
      sum += getInsuranceValue(item.type);
    }
  }
  return sum;
}
