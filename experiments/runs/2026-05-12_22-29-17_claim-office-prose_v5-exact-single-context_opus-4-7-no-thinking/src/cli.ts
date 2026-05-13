#!/usr/bin/env tsx
import { quote, claim, INSURANCE_VALUES } from "./claim-office.js";

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteStep = {
  op: "quote";
  items: Array<{
    type: string;
    material?: string;
    enchantment?: number;
    cursed?: boolean;
  }>;
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause?: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
};

type Step = QuoteStep | ClaimStep;

type PolicyState = {
  items: QuoteStep["items"];
  cap: number;
  remainingCap: number;
};

const insuranceSumForItems = (items: QuoteStep["items"]): number => {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUES[item.type] ?? 0;
  }
  return sum;
};

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });

const main = async () => {
  const raw = await readStdin();
  const scenario: Scenario = JSON.parse(raw);

  const policies: Record<number, PolicyState> = {};
  const results: Array<Record<string, number>> = [];
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const result = quote(scenario.customer, { items: step.items }, contractIndex);
      const insuranceSum = insuranceSumForItems(step.items);
      const cap = 2 * insuranceSum;
      policies[i] = { items: step.items, cap, remainingCap: cap };
      results.push({ premium: result.premium });
      contractIndex++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = claim(policy, step.incident);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }));
};

main();
