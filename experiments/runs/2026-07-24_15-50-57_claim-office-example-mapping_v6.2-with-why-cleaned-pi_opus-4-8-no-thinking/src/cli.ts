#!/usr/bin/env node
import { quote, claim, insuranceSum } from "./claim-office.js";

declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: string, listener: (chunk?: unknown) => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type Result = { premium: number } | { payout: number; remainingCap: number };

const CAP_MULTIPLIER = 2;

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk as string));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

type PolicyState = { items: Item[]; remainingCap: number };

type QuoteContext = {
  customer: Scenario["customer"];
  contractIndex: number;
};

const registerQuote = (
  policies: Map<number, PolicyState>,
  policyId: number,
  step: QuoteStep,
  context: QuoteContext,
): Result => {
  const premium = quote(context.customer, step.items, {
    contractIndex: context.contractIndex,
  });
  policies.set(policyId, {
    items: step.items,
    remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
  });
  return { premium };
};

const settleClaim = (
  policies: Map<number, PolicyState>,
  step: ClaimStep,
): Result => {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Claim references unknown policy: ${step.policy}`);
  }
  const result = claim(policy.items, step.incident, policy.remainingCap);
  policy.remainingCap = result.remainingCap;
  return { payout: result.payout, remainingCap: result.remainingCap };
};

const runScenario = (scenario: Scenario): Result[] => {
  const { customer, steps } = scenario;
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;

  return steps.map((step, policyId) => {
    switch (step.op) {
      case "quote":
        return registerQuote(policies, policyId, step, {
          customer,
          contractIndex: quoteCount++,
        });
      case "claim":
        return settleClaim(policies, step);
      default:
        throw new Error(`Unknown operation: ${(step as { op: string }).op}`);
    }
  });
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    process.stderr.write(
      `Error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  }
};

main();
