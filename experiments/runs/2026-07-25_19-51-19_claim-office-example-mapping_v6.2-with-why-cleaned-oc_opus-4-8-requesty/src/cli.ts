import { quote, claim, insuranceCap } from "./claim-office.js";

type QuoteStep = {
  op: "quote";
  items: { type: string; material?: string; enchantment?: number; cursed?: boolean }[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

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

const runScenario = (scenario: Scenario): Result[] => {
  const { customer, steps } = scenario;
  const results: Result[] = [];
  const remainingCaps = new Map<number, number>();
  let quoteCount = 0;

  steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quote(customer, step.items, quoteCount);
      quoteCount += 1;
      results.push({ premium });
      return;
    }

    const policyStep = steps[step.policy];
    if (!policyStep || policyStep.op !== "quote") {
      throw new Error(`Claim at step ${stepIndex} references invalid policy ${step.policy}`);
    }
    const items = policyStep.items;
    if (!remainingCaps.has(step.policy)) {
      remainingCaps.set(step.policy, insuranceCap(items));
    }
    const currentCap = remainingCaps.get(step.policy)!;
    const result = claim(items, step.incident, currentCap);
    remainingCaps.set(step.policy, result.remainingCap);
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  });

  return results;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

void main();
