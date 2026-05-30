import { quote, claim } from "./claim-office.js";

// Minimal declaration of the Node `process` global we rely on, so the CLI type
// checks without pulling in @types/node. (At runtime it executes under tsx/node,
// where the real `process` is provided.)
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: string, listener: (chunk: string) => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

// The CLI is a thin shell around the domain functions: it reads a JSON scenario
// from stdin, replays the steps in order, and writes the JSON results to stdout.
// Any domain error (unknown item type, invalid claim) is reported on stderr and
// surfaced as a non-zero exit code.

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type Step = QuoteStepInput | ClaimStepInput;

interface QuoteStepInput {
  op: "quote";
  items: { type: string }[];
}

interface ClaimStepInput {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Result = { premium: number } | { payout: number; remainingCap: number };

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

// Replay the scenario's steps in order. A quote both produces a premium and
// records the policy (its items and the running cap) so later claims can refer
// back to it by step index. Each quote is the customer's next contract, so the
// zero-based count of prior quotes drives the follow-up discount.
const runScenario = (scenario: Scenario): Result[] => {
  const policies = new Map<
    number,
    { items: { type: string }[]; remainingCap: number | undefined }
  >();
  let quoteCount = 0;
  const results: Result[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step, quoteCount);
      quoteCount += 1;
      policies.set(index, { items: step.items, remainingCap: undefined });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Claim refers to unknown policy step ${step.policy}`);
    }
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  });

  return results;
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
