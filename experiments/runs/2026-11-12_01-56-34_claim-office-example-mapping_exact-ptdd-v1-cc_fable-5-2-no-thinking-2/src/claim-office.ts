import { type ClaimResult, type Damage, type Policy, issuePolicy, settleClaim } from "./claim.js";
import { type Customer, quotePremium } from "./premium.js";
import type { Item } from "./price-list.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface QuoteResult {
  premium: number;
}

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

function claimedPolicy(step: ClaimStep, policiesByStep: Map<number, Policy>): Policy {
  const policy = policiesByStep.get(step.policy);
  if (policy === undefined) {
    throw new Error(`No policy ${step.policy}: a claim must refer to an earlier quote step`);
  }
  return policy;
}

export function processScenario(scenario: Scenario): ScenarioResults {
  const policiesByStep = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleClaim(claimedPolicy(step, policiesByStep), step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer, policiesByStep.size);
    policiesByStep.set(stepIndex, issuePolicy(step.items));
    return { premium };
  });
  return { results };
}
