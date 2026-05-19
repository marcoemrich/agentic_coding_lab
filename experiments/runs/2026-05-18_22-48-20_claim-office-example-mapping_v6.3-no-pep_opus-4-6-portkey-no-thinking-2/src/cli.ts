import { quote, claim } from "./claim-office.js";

interface PolicyItem {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: PolicyItem[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const readStdin = (): Promise<string> =>
  new Promise<string>((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

const hasPriorQuote = (steps: Step[], currentIndex: number): boolean =>
  currentIndex > 0 && steps.slice(0, currentIndex).some((s) => s.op === "quote");

const input = await readStdin();
const scenario: Scenario = JSON.parse(input);
const policies: Record<number, PolicyItem[]> = {};

const results = scenario.steps.map((step, index) => {
  if (step.op === "quote") {
    const isFollowUp = hasPriorQuote(scenario.steps, index);
    policies[index] = step.items;
    return { premium: quote(scenario.customer, step.items, isFollowUp) };
  }
  if (step.op === "claim") {
    const policyItems = policies[step.policy];
    const result = claim({ items: policyItems }, step.incident.damages);
    return { payout: result.payout, remainingCap: result.remainingCap };
  }
  return {};
});

process.stdout.write(JSON.stringify({ results }));
