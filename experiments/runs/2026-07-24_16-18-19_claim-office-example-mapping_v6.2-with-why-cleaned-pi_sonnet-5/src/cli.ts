import { calculatePremium, type CustomerInput, type ItemInput } from "./premium.js";
import { processClaim } from "./claim.js";

interface QuoteStep {
  op: "quote";
  items: ItemInput[];
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
  customer: CustomerInput;
  steps: Step[];
}

const readStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
};

const main = async (): Promise<void> => {
  const raw = await readStdin();
  const scenario: ScenarioInput = JSON.parse(raw);

  const results: unknown[] = [];
  // Tracks each quote step's insured items and remaining cap, indexed by
  // the quote step's position, so later claim steps can look up the
  // policy they reference and carry forward cap consumption across
  // successive claims against the same policy.
  const policies = new Map<
    number,
    { items: QuoteStep["items"]; remainingCap?: number }
  >();

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = calculatePremium(scenario.customer, step.items);
      policies.set(index, { items: step.items });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Claim references unknown policy step ${step.policy}`);
    }
    const { payout, remainingCap } = processClaim(
      policy.items,
      step.incident.damages,
      policy.remainingCap
    );
    policy.remainingCap = remainingCap;
    results.push({ payout, remainingCap });
  });

  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
