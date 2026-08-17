import { readFileSync } from "node:fs";
import { claim, quote, type Damage, type Item, type Policy } from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
const policies = new Map<number, Policy>();
let previousContracts = 0;
const results = scenario.steps.map((step, stepIndex) => {
  if (step.op === "quote") {
    const result = quote(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
    policies.set(stepIndex, result.policy);
    previousContracts += 1;
    return { premium: result.premium };
  }
  const policy = policies.get(step.policy);
  if (policy === undefined) throw new Error(`Policy does not reference a quote: ${String(step.policy)}`);
  return claim(policy, step.incident.damages);
});
process.stdout.write(JSON.stringify({ results }));
