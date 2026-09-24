import { openPolicy, type Policy, processClaim } from "./policy.js";
import { quotePremium } from "./premium.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioOutput {
  results: object[];
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer, previousContracts);
    previousContracts += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  });
  return { results };
}
