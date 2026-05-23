#!/usr/bin/env node
import { readFileSync } from "node:fs";
import {
  claim,
  createPolicy,
  quote,
  type Customer,
  type Incident,
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
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

const readStdin = (): string => readFileSync(0, "utf8");

const runScenario = (scenario: Scenario): StepResult[] => {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let priorContracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, priorContracts);
      const policy = createPolicy(step.items);
      policies.set(index, policy);
      priorContracts += 1;
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step: ${step.policy}`);
      }
      const result = claim(policy, step.incident);
      policies.set(step.policy, { ...policy, remainingCap: result.remainingCap });
      results.push(result);
    }
  });

  return results;
};

const main = (): void => {
  try {
    const scenario: Scenario = JSON.parse(readStdin());
    const results = runScenario(scenario);
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

main();
