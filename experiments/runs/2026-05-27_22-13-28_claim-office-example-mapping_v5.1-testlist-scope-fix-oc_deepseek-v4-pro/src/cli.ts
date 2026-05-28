import { calculatePremium, type Item } from "./premium.js";
import { processClaim, type Incident, type ClaimResult } from "./claim.js";

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

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

type StepResult = QuoteResult | ClaimResult;

interface Output {
  results: StepResult[];
}

interface StoredPolicy {
  items: Item[];
  totalPayouts: number;
}

export function processScenario(scenario: Scenario): Output {
  const policies: (StoredPolicy | null)[] = [];
  const results: StepResult[] = [];
  let quoteCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp);
      results.push({ premium });
      policies.push({ items: step.items, totalPayouts: 0 });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy at index ${step.policy} not found`);
      }
      const claimResult = processClaim(policy.items, step.incident, policy.totalPayouts);
      results.push(claimResult);
      policy.totalPayouts += claimResult.payout;
    }
  }

  return { results };
}

export async function runCLI(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data);
    });
  });
}