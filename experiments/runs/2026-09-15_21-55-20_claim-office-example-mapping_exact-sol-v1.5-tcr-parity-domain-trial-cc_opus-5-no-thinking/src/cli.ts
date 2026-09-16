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

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

interface ScenarioResults {
  results: StepResult[];
}

/** A policy created by an earlier quote step, with the cap left after prior claims. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyAt(policies: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policies.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`Step ${stepIndex} did not create a policy to claim against`);
  }
  return policy;
}

/**
 * Processes the scenario's steps in order. Each quote counts as a contract for
 * the follow-up discount; each claim draws on the remaining cap of the policy
 * created by the quote step it names.
 */
export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contractIndex);
      contractIndex += 1;
      policies.set(stepIndex, { items: step.items, remainingCap: Number.POSITIVE_INFINITY });
      return { premium };
    }

    const policy = policyAt(policies, step.policy);
    const capBeforeClaim = Number.isFinite(policy.remainingCap) ? policy.remainingCap : undefined;
    const result = claim(policy.items, step.incident, capBeforeClaim);
    policy.remainingCap = result.remainingCap;
    return result;
  });

  return { results };
}

function main(): void {
  try {
    const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

// Run only when invoked as the CLI entry point, so importing runScenario is side-effect free.
if (process.argv[1]?.endsWith("cli.ts") === true) {
  main();
}
