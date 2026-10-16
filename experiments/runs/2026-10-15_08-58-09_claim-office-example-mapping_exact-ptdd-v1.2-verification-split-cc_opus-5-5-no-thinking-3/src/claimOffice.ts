import { claim, openPolicy, type ClaimResult, type Damage, type Policy } from "./claims.js";
import { quote, type Customer, type Item, type QuoteResult } from "./premium.js";

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: Customer; steps: (QuoteStep | ClaimStep)[] };
export type ScenarioOutput = { results: (QuoteResult | ClaimResult)[] };

export function runScenario(scenario: Scenario): ScenarioOutput {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return claim(policies.get(step.policy) as Policy, step.incident.damages);
    policies.set(index, openPolicy(step.items));
    return quote(step.items, scenario.customer, contracts++);
  });
  return { results };
}
