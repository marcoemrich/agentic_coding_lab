import {
  ClaimOffice,
  type ClaimResult,
  type Customer,
  type Incident,
  type Item,
} from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

function runStep(office: ClaimOffice, step: Step): StepResult {
  if (step.op === "quote") {
    return { premium: office.quote(step.items) };
  }
  return office.claim(step.policy, step.incident);
}

export function runScenario(scenario: Scenario): StepResult[] {
  const office = new ClaimOffice(scenario.customer);
  return scenario.steps.map((step) => runStep(office, step));
}
