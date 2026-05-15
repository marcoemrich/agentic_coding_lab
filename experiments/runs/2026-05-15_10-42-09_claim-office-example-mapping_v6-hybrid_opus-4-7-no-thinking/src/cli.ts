import { quote, claim } from "./claim-office.js";
import type { Customer, Item, Incident } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type PolicyState = {
  items: Item[];
  capUsed: number;
};

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
};

const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const { customer, steps } = scenario;
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = [];
  let previousQuoteCount = 0;

  steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(customer, step.items, previousQuoteCount);
      policies.set(index, { items: step.items, capUsed: 0 });
      previousQuoteCount += 1;
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy)
        throw new Error(`Claim references unknown policy: ${step.policy}`);
      const { payout, remainingCap } = claim(
        customer,
        policy.items,
        step.incident,
        policy.capUsed,
      );
      policy.capUsed += payout;
      results.push({ payout, remainingCap });
    }
  });

  return { results };
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

main();
