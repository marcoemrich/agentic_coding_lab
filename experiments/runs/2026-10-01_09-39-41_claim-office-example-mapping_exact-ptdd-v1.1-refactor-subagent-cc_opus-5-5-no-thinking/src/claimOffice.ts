import { claim, type ClaimResult, type Incident } from "./claimSettlement.js";
import type { QuoteItem } from "./item.js";
import { policyFor, type Policy } from "./policy.js";
import { quote, type Customer, type QuoteResult } from "./premium.js";
import { assertOnPriceList } from "./priceList.js";

export type { ClaimResult, Damage, Incident } from "./claimSettlement.js";
export type { QuoteItem } from "./item.js";
export type { Customer, QuoteResult } from "./premium.js";

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = QuoteResult | ClaimResult;

function assertInsurable(items: QuoteItem[]): void {
  items.forEach((item) => assertOnPriceList(item.type));
}

function isFollowUpContract(stepIndex: number): boolean {
  return stepIndex > 0;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      return claim(step.incident, policies.get(step.policy) as Policy);
    }
    assertInsurable(step.items);
    const quoteResult = quote(step.items, scenario.customer, isFollowUpContract(stepIndex));
    policies.set(stepIndex, policyFor(step.items));
    return quoteResult;
  });
  return { results };
}
