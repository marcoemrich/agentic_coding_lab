import { quote, claim } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Array<Record<string, unknown>> };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
};
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};
type Result = { premium: number } | { payout: number };

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const run = async (): Promise<void> => {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const results: Result[] = [];
  let previousQuotes = 0;
  const policies: Array<QuoteStep["items"] | undefined> = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = quote(
        { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, previousQuotes },
        step.items as Parameters<typeof quote>[1],
      );
      results.push({ premium });
      policies.push(step.items);
      previousQuotes += 1;
    } else {
      const policyItems = policies[step.policy];
      if (!policyItems) {
        throw new Error(`Claim references missing policy at index ${step.policy}`);
      }
      const payout = claim(
        policyItems as Parameters<typeof claim>[0],
        step.incident,
      );
      results.push({ payout });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
};

run().catch((err: Error) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
