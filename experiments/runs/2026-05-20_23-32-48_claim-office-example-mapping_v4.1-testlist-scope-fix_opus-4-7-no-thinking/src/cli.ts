import { quote, claim, policyCap } from "./claim-office.js";

type Customer = { yearsWithMHPCO: number; previousContract: boolean };
type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { damages: { itemType: string; amount: number }[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number; previousContract?: boolean }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let buffer = "";
    process.stdin.on("data", (chunk) => {
      buffer += chunk;
    });
    process.stdin.on("end", () => resolve(buffer));
  });
}

function normalizeCustomer(customer: Scenario["customer"]): Customer {
  return {
    yearsWithMHPCO: customer.yearsWithMHPCO,
    previousContract: customer.previousContract ?? false,
  };
}

function processClaim(
  step: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult {
  const policyItems = (steps[step.policy] as QuoteStep).items;
  const currentCap = remainingCaps.get(step.policy) ?? policyCap(policyItems);
  const result = claim({ remainingCap: currentCap, items: policyItems }, step.incident);
  remainingCaps.set(step.policy, result.remainingCap);
  return result;
}

function runScenario(scenario: Scenario): { results: StepResult[] } {
  const customer = normalizeCustomer(scenario.customer);
  const results: StepResult[] = [];
  const steps = scenario.steps;
  const remainingCaps = new Map<number, number>();
  let hasQuoted = false;
  for (const step of steps) {
    if (step.op === "quote") {
      const quoteCustomer = { ...customer, previousContract: hasQuoted };
      results.push({ premium: quote({ customer: quoteCustomer, items: step.items }) });
      hasQuoted = true;
    } else if (step.op === "claim") {
      results.push(processClaim(step, steps, remainingCaps));
    }
  }
  return { results };
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
}

main();
