import { readFileSync } from "node:fs";
import { claim, quote, type Customer, type Incident, type Item, type Policy } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Scenario = { customer: Customer; steps: (QuoteStep | ClaimStep)[] };

type QuoteStepResult = { premium: number };
type ClaimStepResult = { payout: number; remainingCap: number };
export type StepResult = QuoteStepResult | ClaimStepResult;

// A claim step refers to the policy by the index of the quote step that created it.
const policyOf = (policies: Map<number, Policy>, index: number): Policy => {
  const policy = policies.get(index);
  if (policy === undefined) throw new Error(`Unknown policy: ${index}`);
  return policy;
};

export const runScenario = ({ customer, steps }: Scenario): StepResult[] => {
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  return steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const { premium, insuranceSum } = quote(customer, step.items, contractIndex++);
      policies.set(stepIndex, { items: step.items, insuranceSum });
      return { premium };
    }
    const { payout, remainingCap, policy } = claim(policyOf(policies, step.policy), step.incident);
    policies.set(step.policy, policy);
    return { payout, remainingCap };
  });
};

// Any failure (malformed JSON, unknown item type, uncovered damage, …) leaves stdout empty
// and reports a one-line description on stderr instead of a stack trace.
try {
  const scenario: Scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
