import { Item } from './catalog';
import { Damage, Policy } from './policy';
import { quote } from './premium';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

class ClaimOffice {
  private readonly policies = new Map<number, Policy>();

  constructor(private readonly yearsWithMHPCO: number) {}

  run(step: QuoteStep | ClaimStep, index: number): StepResult {
    return step.op === 'quote' ? this.runQuote(step, index) : this.runClaim(step);
  }

  private runQuote(step: QuoteStep, index: number): StepResult {
    const customer = { yearsWithMHPCO: this.yearsWithMHPCO, previousContracts: this.policies.size };
    const premium = quote(step.items, customer);
    this.policies.set(index, new Policy(step.items));
    return { premium };
  }

  private runClaim(step: ClaimStep): StepResult {
    const policy = this.policies.get(step.policy);
    if (!policy) {
      throw new Error(`No policy at step ${step.policy}`);
    }
    return policy.claim(step.incident.damages);
  }
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const office = new ClaimOffice(scenario.customer.yearsWithMHPCO);
  return { results: scenario.steps.map((step, index) => office.run(step, index)) };
}
