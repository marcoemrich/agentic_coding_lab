import { createInterface } from "node:readline";
import {
  quote,
  createPolicy,
  claim,
  type QuoteItem,
  type Policy,
} from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const readStdin = async (): Promise<string> => {
  const lines: string[] = [];
  const rl = createInterface({ input: process.stdin, terminal: false });
  for await (const line of rl) {
    lines.push(line);
  }
  return lines.join("\n");
};

const main = async (): Promise<void> => {
  const raw = await readStdin();
  const input: ScenarioInput = JSON.parse(raw);

  const policies = new Map<number, Policy>();
  let quoteStepsSeen = 0;
  const results: unknown[] = [];

  for (const [index, step] of input.steps.entries()) {
    if (step.op === "quote") {
      const isFollowUpContract = quoteStepsSeen > 0;
      quoteStepsSeen += 1;
      const result = quote(input.customer, step.items, {
        isFollowUpContract,
      });
      const policy = createPolicy(step.items);
      policies.set(index, policy);
      results.push({ premium: result.premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step: ${step.policy}`);
      }
      const result = claim(policy, step.incident);
      results.push(result);
    } else {
      throw new Error(`Unknown step op: ${JSON.stringify(step)}`);
    }
  }

  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
});
