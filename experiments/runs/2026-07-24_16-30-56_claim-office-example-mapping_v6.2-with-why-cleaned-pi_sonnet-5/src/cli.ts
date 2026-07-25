import {
  computeQuotePremium,
  processClaim,
  KNOWN_ITEM_TYPES,
} from "./claim-office.js";

type QuoteStep = {
  op: "quote";
  items: { type: string; [key: string]: unknown }[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const validateItemTypes = (items: { type: string }[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
};

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

type PolicyRecord = { items: { type: string }[]; remainingCap?: number };

const runQuoteStep = (
  step: QuoteStep,
  customer: Scenario["customer"],
  policies: PolicyRecord[]
): { premium: number } => {
  validateItemTypes(step.items);
  const premium = computeQuotePremium(step.items, customer);
  policies.push({ items: step.items });
  return { premium };
};

const runClaimStep = (step: ClaimStep, policies: PolicyRecord[]): unknown => {
  const policy = policies[step.policy];
  if (!policy) {
    throw new Error(`Claim references unknown policy index ${step.policy}`);
  }
  const claimResult = processClaim(policy.items, step.incident, {
    remainingCap: policy.remainingCap,
  });
  policy.remainingCap = claimResult.remainingCap;
  return claimResult;
};

const runScenario = (scenario: Scenario): unknown[] => {
  const policies: PolicyRecord[] = [];
  const results: unknown[] = [];

  for (const step of scenario.steps) {
    results.push(
      step.op === "quote"
        ? runQuoteStep(step, scenario.customer, policies)
        : runClaimStep(step, policies)
    );
  }

  return results;
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
});
