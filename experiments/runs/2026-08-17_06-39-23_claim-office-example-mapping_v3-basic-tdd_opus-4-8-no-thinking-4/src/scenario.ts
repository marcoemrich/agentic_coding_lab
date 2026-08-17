import { assertKnownItems, createPolicy, processClaim, PolicyState } from './claim';
import { quotePremium, QuoteItem } from './premium';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: 'quote';
  items: QuoteItem[];
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

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: StepResult[];
}

class ScenarioRunner {
  private readonly policies = new Map<number, PolicyState>();
  private quoteCount = 0;

  constructor(private readonly customer: Customer) {}

  runStep(step: Step, index: number): StepResult {
    return step.op === 'quote' ? this.runQuote(step, index) : this.runClaim(step);
  }

  private runQuote(step: QuoteStep, index: number): StepResult {
    assertKnownItems(step.items);
    const isFollowUp = this.quoteCount > 0;
    this.quoteCount += 1;
    this.policies.set(index, createPolicy(step.items));
    const premium = quotePremium(step.items, {
      yearsWithMHPCO: this.customer.yearsWithMHPCO,
      isFollowUp,
    });
    return { premium };
  }

  private runClaim(step: ClaimStep): StepResult {
    const policy = this.policies.get(step.policy);
    if (!policy) {
      throw new Error(`claim references unknown policy step ${step.policy}`);
    }
    return processClaim(policy, step.incident.damages);
  }
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const runner = new ScenarioRunner(scenario.customer);
  const results = scenario.steps.map((step, index) => runner.runStep(step, index));
  return { results };
}
