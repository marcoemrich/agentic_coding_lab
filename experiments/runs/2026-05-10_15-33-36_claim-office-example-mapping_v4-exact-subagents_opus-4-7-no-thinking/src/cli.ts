import { quote, createPolicy, claim, type Policy } from "./claim-office.js";

type Customer = { yearsWithMHPCO: number; previousContracts?: number };
type QuoteStep = { op: "quote"; items: Parameters<typeof createPolicy>[0] };
type ClaimStep = { op: "claim"; policy: number; incident: Parameters<typeof claim>[1] };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type StepResult = { premium: number } | { payout: number; remainingCap: number };

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

function processQuote(
  step: QuoteStep,
  customer: Customer,
  previousQuoteCount: number
): { result: StepResult; policy: Policy } {
  const customerWithHistory = {
    ...customer,
    previousContracts: (customer.previousContracts ?? 0) + previousQuoteCount,
  };
  const premium = quote(customerWithHistory, step.items);
  return { result: { premium }, policy: createPolicy(step.items) };
}

function processClaim(
  step: ClaimStep,
  policiesByStep: Record<number, Policy>
): StepResult {
  const policy = policiesByStep[step.policy];
  const { payout, remainingCap } = claim(policy, step.incident);
  return { payout, remainingCap };
}

function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policiesByStep: Record<number, Policy> = {};
  let previousQuoteCount = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const { result, policy } = processQuote(step, scenario.customer, previousQuoteCount);
      results.push(result);
      policiesByStep[i] = policy;
      previousQuoteCount++;
    } else {
      results.push(processClaim(step, policiesByStep));
    }
  }
  return { results };
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
}

main().catch((err) => {
  process.stderr.write(String(err?.message ?? err) + "\n");
  process.exit(1);
});
