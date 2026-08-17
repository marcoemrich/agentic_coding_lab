import { QuoteItem } from './basePremium';
import { quotePremium } from './premium';
import { createPolicy, processClaim, Incident, Policy } from './claim';

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
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

function runQuote(step: QuoteStep, customer: Customer, quoteCount: number): number {
  return quotePremium(step.items, {
    years: customer.yearsWithMHPCO,
    contractIndex: quoteCount,
  });
}

function runClaim(step: ClaimStep, policies: Map<number, Policy>): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Claim references step ${step.policy} which is not a quote`);
  }
  return processClaim(policy, step.incident);
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = runQuote(step, scenario.customer, quoteCount);
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
      results.push({ premium });
    } else {
      results.push(runClaim(step, policies));
    }
  });

  return { results };
}
