import type { Damage, Settlement } from "./claim.js";
import { type Customer, CustomerContracts, type Quote } from "./customer-contracts.js";
import type { Item } from "./price-list.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface ScenarioResults {
  results: (Quote | Settlement)[];
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const contracts = new CustomerContracts(scenario.customer);
  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "quote"
      ? contracts.quote(stepIndex, step.items)
      : contracts.claim(step.policy, step.incident.damages),
  );
  return { results };
}
