import { quote, type Item } from "./quote.js";
import { insuranceSum, processClaim, type PolicyItem } from "./claim.js";

const CAP_MULTIPLIER = 2;

interface CustomerInput {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: CustomerInput;
  steps: Step[];
}

interface PolicyState {
  items: PolicyItem[];
  remainingCap: number;
}

function main(): void {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const scenario = JSON.parse(input) as Scenario;
      const results = run(scenario);
      process.stdout.write(JSON.stringify({ results }) + "\n");
    } catch (err) {
      process.stderr.write(String((err as Error).message) + "\n");
      process.exitCode = 1;
    }
  });
}

function run(scenario: Scenario): unknown[] {
  const policies: PolicyState[] = [];
  const results: unknown[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(handleQuote(scenario, step, policies));
    } else {
      results.push(handleClaim(step, policies));
    }
  }

  return results;
}

function handleQuote(scenario: Scenario, step: QuoteStep, policies: PolicyState[]): unknown {
  const contractNumber = policies.length + 1;
  const premium = quote(scenario.customer, step.items, contractNumber);
  const policyItems = step.items.map((i) => ({ ...i }));
  policies.push({ items: policyItems, remainingCap: insuranceSum(policyItems) * CAP_MULTIPLIER });
  return { premium };
}

function handleClaim(step: ClaimStep, policies: PolicyState[]): unknown {
  const policy = policies[step.policy];
  const r = processClaim(policy.items, policy.remainingCap, step.incident.damages);
  policy.remainingCap = r.remainingCap;
  return { payout: r.payout, remainingCap: r.remainingCap };
}

main();