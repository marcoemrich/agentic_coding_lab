import { quote, claim, INSURANCE_VALUES } from "./claim-office.js";
import type { Customer, Item } from "./claim-office.js";

type InputDamage = { amount: number; enchantment?: number; material?: string; itemType?: string };
type InputIncident = { damages: InputDamage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: InputIncident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number; priorContracts?: number }; steps: Step[] };

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const toDamage = (d: InputDamage) => ({
  amount: d.amount,
  enchantment: d.enchantment ?? 0,
  material: d.material ?? "unknown",
});

const run = () => {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
  process.stdin.on("end", () => {
    const scenario: Scenario = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const customer: Customer = {
      yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
      priorContracts: scenario.customer.priorContracts ?? 0,
    };

    const policies: Array<{ insuranceSum: number; remainingCap: number }> = [];
    const results: unknown[] = [];

    for (const step of scenario.steps) {
      if (step.op === "quote") {
        const premium = quote(customer, step.items);
        const insuranceSum = insuranceSumForItems(step.items);
        policies.push({ insuranceSum, remainingCap: 2 * insuranceSum });
        results.push({ premium });
      } else {
        const policy = policies[step.policy];
        const incident = { damages: step.incident.damages.map(toDamage) };
        const result = claim(policy, incident);
        policy.remainingCap = result.remainingCap;
        results.push({ payout: result.payout, remainingCap: result.remainingCap });
      }
    }

    process.stdout.write(JSON.stringify({ results }) + "\n");
  });
};

run();
