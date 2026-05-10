import { readFileSync } from "fs";
import { quote, claim, type Customer, type Item, type Damage } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policyStep: number; incident: { damages: Damage[] } };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer;
  steps: Step[];
};

type StepResult = { premium?: number; payout?: number; remainingCap?: number };

type Policy = { items: Item[]; accumulatedPaid: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policiesByStep: Record<number, Policy> = {};

  const handleStep = (step: Step, index: number): StepResult => {
    if (step.op === "quote") {
      policiesByStep[index] = { items: step.items, accumulatedPaid: 0 };
      return { premium: quote(scenario.customer, step.items) };
    }
    const policy = policiesByStep[step.policyStep] ?? { items: [], accumulatedPaid: 0 };
    const result = claim(policy.items, step.incident.damages, policy.accumulatedPaid);
    policy.accumulatedPaid += result.payout;
    return { payout: result.payout, remainingCap: result.remainingCap };
  };

  return { results: scenario.steps.map(handleStep) };
}

function main(): void {
  try {
    const input = readFileSync(0, "utf-8");
    const scenario = JSON.parse(input) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stderr.write(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith("cli.ts") || process.argv[1]?.endsWith("cli.js")) {
  main();
}
