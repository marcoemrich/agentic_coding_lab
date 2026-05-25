import { quote, type Item, type Customer } from "./quote.js";
import { claim, policyCap } from "./claim.js";

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
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResultDTO {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResultDTO;

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function readAllStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function processScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;
  const results: StepResult[] = [];

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const premium = quote({
        customer: scenario.customer,
        items: step.items,
        contractIndex: quoteCount,
      });
      quoteCount += 1;
      policies.set(i, { items: step.items, remainingCap: policyCap(step.items) });
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step ${step.policy}`);
      }
      const result = claim({
        policy: { items: policy.items, remainingCap: policy.remainingCap },
        incident: step.incident,
      });
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }
  return results;
}

async function main(): Promise<void> {
  try {
    const raw = await readAllStdin();
    const scenario: Scenario = JSON.parse(raw);
    const results = processScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

main();
