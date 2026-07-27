#!/usr/bin/env node
import { quote, claim } from "./claim-office.js";
import type { QuoteInput, Incident, Policy, ClaimResult } from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: QuoteInput["items"];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

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

const processScenario = (scenario: Scenario): StepResult[] => {
  const customer = scenario.customer;
  const policies: Record<number, Policy> = {};
  const remainingCaps: Record<number, number> = {};
  const results: StepResult[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(
        { items: step.items },
        { yearsWithMHPCO: customer.yearsWithMHPCO, contractIndex: quoteCount },
      );
      policies[index] = { items: step.items };
      quoteCount += 1;
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (policy === undefined) {
        throw new Error(`Claim references unknown policy step: ${step.policy}`);
      }
      const availableCap =
        remainingCaps[step.policy] !== undefined ? remainingCaps[step.policy] : undefined;
      const result: ClaimResult =
        availableCap !== undefined
          ? claim(policy, step.incident, availableCap)
          : claim(policy, step.incident);
      remainingCaps[step.policy] = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  });

  return results;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const results = processScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

void main();
