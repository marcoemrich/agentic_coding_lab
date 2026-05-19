import { quote } from "./claim-office.js";

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: unknown[];
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

type Result = QuoteResult | ClaimResult;

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const results: Result[] = [];
  let quoteCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      const premium = quote(scenario.customer, step.items, isFollowUp);
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policyIndex = step.policy;
      const policyStep = scenario.steps[policyIndex];
      if (!policyStep || policyStep.op !== "quote") {
        process.stderr.write(
          `Error: claim references invalid policy index ${policyIndex}\n`
        );
        process.exit(1);
      }
      // Claim processing will be implemented as tests drive it
      results.push({ payout: 0, remainingCap: 0 });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
});
