import { type Incident, type Policy, claim, createPolicy } from "./claim.js";
import { type Customer, type Item, quote } from "./quote.js";

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
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

function policyCreatedBy(policiesByStep: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policiesByStep.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`Claim refers to step ${stepIndex}, which created no policy`);
  }
  return policy;
}

/**
 * Runs a scenario's steps in order for a single customer. Every quote step is a further
 * contract for that customer and creates the policy that later claim steps refer to.
 */
function runScenario(scenario: Scenario): StepResult[] {
  const policiesByStep = new Map<number, Policy>();
  let contractsSoFar = 0;

  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return claim(policyCreatedBy(policiesByStep, step.policy), step.incident);
    }
    const customer: Customer = {
      yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
      previousContracts: contractsSoFar,
    };
    const premium = quote(step.items, customer);
    contractsSoFar += 1;
    policiesByStep.set(stepIndex, createPolicy(step.items));
    return { premium };
  });
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

void main();
