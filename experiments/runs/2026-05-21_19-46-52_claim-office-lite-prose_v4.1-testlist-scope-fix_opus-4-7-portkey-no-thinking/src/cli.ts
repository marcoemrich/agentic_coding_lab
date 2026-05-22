import { quote, claim, Item, Incident } from "./claim-office.js";

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type Result = { premium: number } | { payout: number };

function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Item[]>();
  let quotesSoFar = 0;
  const results: Result[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, quotesSoFar);
      policies.set(index, step.items);
      quotesSoFar += 1;
      results.push({ premium });
    } else {
      const policyItems = policies.get(step.policy) ?? [];
      const payout = claim(policyItems, step.incident);
      results.push({ payout });
    }
  });

  return { results };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

readStdin().then((input) => {
  const scenario = JSON.parse(input) as Scenario;
  const output = processScenario(scenario);
  process.stdout.write(JSON.stringify(output));
});
