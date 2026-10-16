import { claim, openPolicy, type ClaimResult, type Policy, type Damage } from "./claim.js";
import { premium, type Customer, type QuoteItem } from "./premium.js";

export type { ClaimResult, Customer, Damage, QuoteItem };

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
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

function hasEarlierContract(steps: Step[], index: number): boolean {
  return steps.slice(0, index).some((step) => step.op === "quote");
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies.set(index, openPolicy(step.items));
      return { premium: premium(scenario.customer, step.items, hasEarlierContract(scenario.steps, index)) };
    }
    return claim(policies.get(step.policy) as Policy, step.incident.damages);
  });
}
