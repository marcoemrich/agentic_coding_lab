import { quote, claim } from "./claim-office.js";

// Minimal local declaration of the Node `process` surface the CLI uses, so the
// file type-checks without depending on @types/node (not part of this kata's
// devDependencies). The CLI is executed with `tsx`/Node at runtime.
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
    on(event: "error", listener: (error: unknown) => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

interface ScenarioItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: ScenarioItem[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

// State tracked per quote step so later claim steps can resolve their policy
// and thread the running cap across successive claims.
interface PolicyState {
  items: ScenarioItem[];
  remainingCap: number | undefined;
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function processScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      // Every item in a quote is treated as a first insurance regardless of
      // customer history; a follow-up discount applies to each quote after the
      // customer's first one in the scenario.
      const followUp = quoteCount > 0;
      const premium = quote({
        customer: scenario.customer,
        items: step.items,
        firstInsurance: true,
        followUp,
      });
      policies.set(index, { items: step.items, remainingCap: undefined });
      quoteCount += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policyState = policies.get(step.policy);
      if (policyState === undefined) {
        throw new Error(`Claim references unknown policy step ${step.policy}`);
      }
      const result = claim(
        { items: policyState.items },
        step.incident,
        policyState.remainingCap,
      );
      policyState.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    } else {
      throw new Error(`Unknown step op "${(step as { op: string }).op}"`);
    }
  });

  return results;
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const results = processScenario(scenario);
  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
});
