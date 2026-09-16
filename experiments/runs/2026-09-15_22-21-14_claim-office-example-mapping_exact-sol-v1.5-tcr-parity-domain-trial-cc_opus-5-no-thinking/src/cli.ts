import { readFileSync } from "node:fs";
import {
  claimOn,
  policyFor,
  quote,
  type Customer,
  type Damage,
  type Item,
  type Policy,
} from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

function runScenario(scenario: Scenario): StepResult[] {
  const policiesByStep = new Map<number, Policy>();
  let contractsIssued = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contractsIssued);
      contractsIssued += 1;
      policiesByStep.set(index, policyFor(step.items));
      return { premium };
    }
    return claimOn(policyOf(policiesByStep, step), step.incident.damages);
  });
}

function policyOf(policiesByStep: Map<number, Policy>, step: ClaimStep): Policy {
  const policy = policiesByStep.get(step.policy);
  if (policy === undefined) {
    throw new Error(`step ${step.policy} did not create a policy to claim against`);
  }
  return policy;
}

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }) + "\n");
} catch (refusal) {
  // The MHPCO refuses the whole scenario: describe why, write no results.
  process.stderr.write(`${(refusal as Error).message}\n`);
  process.exit(1);
}
