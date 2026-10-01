import { Customer, Item, ValidationError } from './catalog';
import { ClaimResult, Damage, Policy } from './policy';
import { quotePremium } from './premium';

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

export type StepResult = { premium: number } | ClaimResult;

function requireArray<T>(value: unknown, what: string): T[] {
  if (!Array.isArray(value)) throw new ValidationError(`${what} must be an array`);
  return value as T[];
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  if (typeof scenario?.customer?.yearsWithMHPCO !== 'number') {
    throw new ValidationError('customer.yearsWithMHPCO is required');
  }
  const policies = new Map<number, Policy>();
  let contracts = 0;

  const results = requireArray<QuoteStep | ClaimStep>(scenario.steps, 'steps').map((step, index): StepResult => {
    switch (step?.op) {
      case 'quote': {
        const items = requireArray<Item>(step.items, `steps[${index}].items`);
        const premium = quotePremium(items, scenario.customer, contracts);
        contracts++;
        policies.set(index, new Policy(items));
        return { premium };
      }
      case 'claim': {
        const policy = policies.get(step.policy);
        if (!policy) throw new ValidationError(`steps[${index}] references unknown policy ${step.policy}`);
        return policy.claim(requireArray<Damage>(step.incident?.damages, `steps[${index}].incident.damages`));
      }
      default:
        throw new ValidationError(`steps[${index}] has unknown op ${JSON.stringify((step as { op?: unknown })?.op)}`);
    }
  });
  return { results };
}
