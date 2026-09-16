import { ClaimOffice, type Customer, type Incident, type Item } from "./claim-office.js";

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

function runStep(office: ClaimOffice, step: Step): unknown {
  if (step.op === "quote") {
    return { premium: office.quote(step.items) };
  }
  return office.claim(step.policy, step.incident);
}

export function runScenario(scenario: Scenario): { results: unknown[] } {
  const office = new ClaimOffice(scenario.customer);
  return { results: scenario.steps.map((step) => runStep(office, step)) };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

await main();
