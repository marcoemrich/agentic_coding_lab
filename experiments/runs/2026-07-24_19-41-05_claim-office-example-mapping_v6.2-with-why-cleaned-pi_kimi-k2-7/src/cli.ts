#!/usr/bin/env node
import { quote, claim } from "./claim-office.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const parseScenario = (input: string): any => {
  try {
    return JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON input");
  }
};

const getInsuranceValue = (item: any): number => {
  if (!(item.type in INSURANCE_VALUES)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return INSURANCE_VALUES[item.type];
};

const calculateInsuranceSum = (items: any[]): number =>
  items.reduce((sum, item) => sum + getInsuranceValue(item), 0);

const processQuote = (
  scenario: any,
  step: any,
  policies: any[],
): { premium: number } => {
  const contractIndex = policies.length;
  const premium = quote(scenario.customer, step.items, contractIndex);
  const insuranceSum = calculateInsuranceSum(step.items);
  policies.push({
    items: step.items,
    cap: insuranceSum * CAP_MULTIPLIER,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  });
  return { premium };
};

const processClaim = (step: any, policies: any[]): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  if (!policy) {
    throw new Error(`Policy ${step.policy} not found`);
  }
  const result = claim(policy, step.incident);
  policy.remainingCap = result.remainingCap;
  return result;
};

const processStep = (
  scenario: any,
  step: any,
  policies: any[],
): any => {
  if (step.op === "quote") {
    return processQuote(scenario, step, policies);
  }
  if (step.op === "claim") {
    return processClaim(step, policies);
  }
  throw new Error(`Unknown operation: ${step.op}`);
};

const run = async () => {
  const input = await readStdin();
  const scenario = parseScenario(input);

  const results: any[] = [];
  const policies: any[] = [];

  for (const step of scenario.steps) {
    results.push(processStep(scenario, step, policies));
  }

  console.log(JSON.stringify({ results }));
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
