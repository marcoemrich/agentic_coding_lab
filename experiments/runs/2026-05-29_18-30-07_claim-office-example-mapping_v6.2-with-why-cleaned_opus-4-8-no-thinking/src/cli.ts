import {
  quote,
  claim,
  insuranceSum,
  type Customer,
  type Item,
  type Incident,
  type ClaimResult,
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

// The cap a policy starts with: twice its insurance sum.
const CAP_MULTIPLIER = 2;

// Process the scenario's steps in order. A quote creates a policy (its items
// and remaining cap are remembered by step index); a later claim looks its
// policy up by that index, drawing down the shared remaining cap.
const runScenario = (scenario: Scenario): StepResult[] => {
  const policies = new Map<
    number,
    { items: Item[]; remainingCap: number }
  >();
  let contractIndex = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(step.items, scenario.customer, contractIndex);
      contractIndex += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
      });
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Claim references unknown policy step: ${step.policy}`);
    }
    const result = claim(
      { items: policy.items },
      step.incident,
      policy.remainingCap,
    );
    policy.remainingCap = result.remainingCap;
    return result;
  });
};

// Minimal ambient declarations for the Node globals the CLI uses, so the
// project type-checks without depending on @types/node.
declare const process: {
  stdin: AsyncIterable<{ toString(encoding: string): string }>;
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk.toString("utf8"));
  }
  return chunks.join("");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
