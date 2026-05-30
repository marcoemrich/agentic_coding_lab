import {
  quote,
  claim,
  policyCap,
  type Customer,
  type Item,
  type Incident,
} from "./claim-office.js";

// Minimal ambient declaration for the Node `process` global used below. The
// project does not depend on @types/node, so we declare just the surface this
// CLI touches rather than pulling in the full type package.
interface ReadableStream {
  setEncoding(encoding: string): void;
  on(event: "data", listener: (chunk: string) => void): void;
  on(event: "end", listener: () => void): void;
  on(event: "error", listener: (error: unknown) => void): void;
}
interface WritableStream {
  write(text: string): void;
}
declare const process: {
  stdin: ReadableStream;
  stdout: WritableStream;
  stderr: WritableStream;
  exit(code: number): never;
};

interface QuoteStepInput {
  op: "quote";
  items: Item[];
}

interface ClaimStepInput {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStepInput | ClaimStepInput;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type Result = { premium: number } | { payout: number; remainingCap: number };

// The state a quote step leaves behind for later claim steps to draw on: the
// insured items (needed to reimburse damages) and the cap remaining after any
// prior claims against this policy.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });

// The policy a claim step refers to, failing if no earlier quote step created
// one at that index. Looking it up is a distinct operation from applying the
// claim, so naming it keeps runScenario's claim branch at "find the policy,
// then claim against it".
const resolvePolicy = (policies: Map<number, Policy>, step: number): Policy => {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`claim references unknown policy step: ${step}`);
  }
  return policy;
};

// Runs the scenario, processing steps in order. Quote steps create a policy and
// advance the customer's quote count (each quote after the first is a follow-up
// contract); claim steps draw on the policy created by an earlier quote step,
// carrying its remaining cap forward.
const runScenario = (scenario: Scenario): Result[] => {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const result = quote(scenario.customer, { items: step.items }, quoteCount);
      quoteCount += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: policyCap(step.items),
      });
      return result;
    }

    const policy = resolvePolicy(policies, step.policy);
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
};

const main = async (): Promise<void> => {
  const scenario: Scenario = JSON.parse(await readStdin());
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
