import { quote, claim, policyCap, type Item } from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface PolicyState {
  items: Item[];
  capRemaining: number;
}

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

  const policies: Record<number, PolicyState> = {};
  const results: unknown[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, quoteCount);
      policies[index] = { items: step.items, capRemaining: policyCap(step.items) };
      quoteCount += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references unknown policy at step ${step.policy}`);
      }
      const result = claim(policy, step.incident, policy.capRemaining);
      policy.capRemaining = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    } else {
      throw new Error(`Unknown operation`);
    }
  });

  process.stdout.write(JSON.stringify({ results }));
};

run().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
