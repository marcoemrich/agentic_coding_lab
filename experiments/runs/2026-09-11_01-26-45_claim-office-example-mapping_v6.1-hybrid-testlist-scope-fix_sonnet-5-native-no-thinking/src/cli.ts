import { quote, type Customer, type QuoteItem } from "./quote.js";
import { claim, type PolicyItem, type Damage } from "./claim.js";

interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
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

interface QuoteStepResult {
  premium: number;
}

interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const toPolicyItems = (items: QuoteItem[]): PolicyItem[] =>
  items.map((item) => ({
    type: item.type,
    enchantment: item.enchantment,
    cursed: item.cursed,
  }));

const run = async (): Promise<void> => {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);

  const policies = new Map<number, PolicyItem[]>();
  const capUsage = new Map<number, number>();
  const results: Array<QuoteStepResult | ClaimStepResult> = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const quoteContractIndex = scenario.steps
        .slice(0, index)
        .filter((s) => s.op === "quote").length;
      const result = quote(scenario.customer, step.items, quoteContractIndex);
      policies.set(index, toPolicyItems(step.items));
      capUsage.set(index, 0);
      results.push({ premium: result.premium });
    } else {
      const policyItems = policies.get(step.policy);
      if (!policyItems) {
        throw new Error(`Claim references unknown policy step ${step.policy}`);
      }
      const priorPayouts = capUsage.get(step.policy) ?? 0;
      const result = claim(policyItems, step.incident.damages, priorPayouts);
      capUsage.set(step.policy, priorPayouts + result.payout);
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  });

  process.stdout.write(JSON.stringify({ results }));
};

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
