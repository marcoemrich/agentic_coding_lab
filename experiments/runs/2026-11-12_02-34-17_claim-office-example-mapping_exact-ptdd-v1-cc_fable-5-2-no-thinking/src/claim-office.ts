import { settleClaim, type ClaimSettlement, type Damage } from "./claim.js";
import type { Item } from "./item.js";
import { issuePolicy, type Policy } from "./policy.js";
import { quotePremium, type Customer } from "./premium.js";

export type { Customer, Damage, Item };

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type StepResult = QuoteResult | ClaimSettlement;

export interface ScenarioOutcome {
  results: StepResult[];
}

function policyCreatedBy(policies: Map<number, Policy>, step: number): Policy {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`Step ${step} did not create a policy`);
  }
  return policy;
}

export function processScenario(scenario: Scenario): ScenarioOutcome {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleClaim(policyCreatedBy(policies, step.policy), step.incident.damages);
    }
    const previousContracts = policies.size;
    policies.set(stepIndex, issuePolicy(step.items));
    return { premium: quotePremium(step.items, scenario.customer, previousContracts) };
  });
  return { results };
}
