import { readFileSync } from "node:fs";

import { claim, quote, type Customer, type Incident, type Item } from "./claim-office.js";

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

interface PolicyState {
  items: Item[];
  remainingCap?: number;
}

function readStdin(): string {
  return readFileSync(0, "utf8");
}

function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contractIndex);
      contractIndex += 1;
      policies.set(index, { items: step.items });
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Step ${index} references no policy at step ${step.policy}`);
    }
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    results.push(result);
  });

  return results;
}

function main(): void {
  try {
    const scenario = JSON.parse(readStdin()) as Scenario;
    process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

main();
