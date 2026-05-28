import { quote, processClaim, type Policy } from "./claim-office.js";

interface StdinItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: StdinItem[];
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Input {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface Output {
  results: StepResult[];
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function createPolicy(items: StdinItem[]): Policy {
  let totalInsuranceSum = 0;
  for (const item of items) {
    const val = INSURANCE_VALUES[item.type];
    if (val === undefined) throw new Error(`Unknown item type: ${item.type}`);
    totalInsuranceSum += val;
  }
  return { items, remainingCap: totalInsuranceSum * 2 };
}

async function main(): Promise<void> {
  const inputJson = await new Promise<string>((resolve, reject) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });

  let input: Input;
  try {
    input = JSON.parse(inputJson) as Input;
  } catch {
    process.stderr.write("Invalid JSON input\n");
    process.exit(1);
  }

  const policies: Policy[] = [];
  const results: StepResult[] = [];

  for (let stepIndex = 0; stepIndex < input.steps.length; stepIndex++) {
    const step = input.steps[stepIndex];

    try {
      if (step.op === "quote") {
        const premium = quote(input.customer, step.items, stepIndex > 0);
        results.push({ premium });

        const policy = createPolicy(step.items);
        policies.push(policy);
      } else if (step.op === "claim") {
        if (step.policy < 0 || step.policy >= policies.length) {
          throw new Error(`Invalid policy index: ${step.policy}`);
        }
        const policy = policies[step.policy];
        const claimResult = processClaim(policy, step.incident);
        results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`${message}\n`);
      process.exit(1);
    }
  }

  const output: Output = { results };
  process.stdout.write(JSON.stringify(output) + "\n");
}

main();