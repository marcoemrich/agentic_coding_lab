import { quote, claim } from "./claim-office.js";

type QuoteStep = {
  op: "quote";
  items: Array<{ type: string; material?: string; cursed?: boolean; enchantment?: number }>;
  firstInsurance?: boolean;
  followUp?: boolean;
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause?: string; damages: Array<{ itemType: string; amount: number }> };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

type PolicyState = {
  items: QuoteStep["items"];
  remainingCap: number;
};

const processStep = (
  step: Step,
  scenario: Scenario,
  policies: Map<number, PolicyState>,
  stepIndex: number,
): StepResult => {
  if (step.op === "quote") {
    const result = quote({
      customer: scenario.customer,
      firstInsurance: step.firstInsurance,
      followUp: step.followUp,
      items: step.items,
    });
    const insuranceSum = step.items.reduce(
      (sum, item) => sum + insuranceValueByType[item.type],
      0,
    );
    policies.set(stepIndex, {
      items: step.items,
      remainingCap: 2 * insuranceSum,
    });
    return result;
  }
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Unknown policy index: ${step.policy}`);
  }
  const result = claim({
    policy: { items: policy.items },
    incident: { damages: step.incident.damages },
  });
  // Apply the running-cap state to subsequent claims on this policy
  const usedCap = result.payout;
  const newRemaining = policy.remainingCap - usedCap;
  const clampedPayout = Math.min(result.payout, policy.remainingCap);
  policy.remainingCap = Math.max(0, newRemaining);
  return { payout: clampedPayout, remainingCap: policy.remainingCap };
};

const insuranceValueByType: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const main = async (): Promise<void> => {
  try {
    const raw = await readStdin();
    const scenario: Scenario = JSON.parse(raw);
    const policies = new Map<number, PolicyState>();
    const results = scenario.steps.map((step, i) =>
      processStep(step, scenario, policies, i),
    );
    process.stdout.write(JSON.stringify({ results }));
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }
};

main();
