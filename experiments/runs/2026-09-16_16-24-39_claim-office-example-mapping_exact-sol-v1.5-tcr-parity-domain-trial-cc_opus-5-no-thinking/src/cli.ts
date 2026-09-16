import { readFileSync } from "node:fs";
import { createPolicy, processClaim, quote } from "./claim-office.js";
import type { Customer, Incident, Item, Policy } from "./claim-office.js";

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

type StepResult = { premium: number } | { payout: number; remainingCap: number };

function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contractsSoFar);
      contractsSoFar += 1;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`step ${step.policy} did not create a policy`);
    }
    return processClaim(policy, step.incident);
  });
}

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify({ results: runScenario(scenario) })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
