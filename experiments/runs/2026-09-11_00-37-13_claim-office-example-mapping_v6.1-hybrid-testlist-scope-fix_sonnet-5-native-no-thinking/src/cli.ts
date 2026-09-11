import { calculatePremium, type Customer, type Item } from "./premium.js";
import { calculatePayout, type Damage } from "./claim.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const run = async (): Promise<void> => {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);

  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; capRemaining?: number }>();
  const results: unknown[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFirstContract = quoteCount === 0;
      quoteCount += 1;
      const premium = calculatePremium(
        scenario.customer,
        step.items,
        isFirstContract,
      );
      policies.set(index, { items: step.items });
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step: ${step.policy}`);
      }
      const result = calculatePayout(
        policy.items,
        step.incident.damages,
        policy.capRemaining,
      );
      policy.capRemaining = result.remainingCap;
      results.push(result);
    }
  });

  process.stdout.write(JSON.stringify({ results }));
};

run().catch((error: Error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
