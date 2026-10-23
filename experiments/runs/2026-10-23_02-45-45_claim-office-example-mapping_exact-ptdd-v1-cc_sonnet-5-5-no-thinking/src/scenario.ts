import type { Damage } from "./damaged-items.js";
import type { ClaimResult } from "./policy.js";
import { PolicyRegister } from "./policy-register.js";
import { quotePremium, type Item } from "./premium.js";

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
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteResult {
  premium: number;
}

export interface ScenarioResults {
  results: Array<QuoteResult | ClaimResult>;
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const register = new PolicyRegister();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const followUp = register.hasPriorContract;
      register.open(index, step.items);
      const context = { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, followUp };
      return { premium: quotePremium(step.items, context) };
    }
    return register.find(step.policy).claim(step.incident.damages);
  });
  return { results };
}
