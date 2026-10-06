import { readFileSync } from "node:fs";
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

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | ClaimResult;

function runScenario(scenario: Scenario): StepResult[] {
  const office = new ClaimOffice(scenario.customer);
  return scenario.steps.map((step) =>
    step.op === "quote"
      ? { premium: office.quote(step.items) }
      : office.claim(step.policy, step.incident),
  );
}

const REJECTED_EXIT_CODE = 1;

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(REJECTED_EXIT_CODE);
}
