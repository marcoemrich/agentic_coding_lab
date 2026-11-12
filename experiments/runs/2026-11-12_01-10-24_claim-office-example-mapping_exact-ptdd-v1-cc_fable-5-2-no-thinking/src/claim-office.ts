import { CustomerAccount, type Quote } from "./customer-account.js";
import type { Item } from "./item.js";
import type { ClaimSettlement, Damage } from "./policy.js";

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface ScenarioResults {
  results: (Quote | ClaimSettlement)[];
}

// A policy is referred to by the zero-based index of the quote step that created it.
export function processScenario(scenario: Scenario): ScenarioResults {
  const account = new CustomerAccount(scenario.customer.yearsWithMHPCO);
  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "quote" ? account.quote(stepIndex, step.items) : account.claim(step.policy, step.incident.damages),
  );
  return { results };
}
