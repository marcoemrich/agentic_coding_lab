import { createInterface } from "readline";
import { quote, claim } from "./claim-office.js";
import type { Customer, Item, Policy, Incident } from "./claim-office.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

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

interface PolicyState {
  policy: Policy;
  remainingCap: number;
}

const main = async (): Promise<void> => {
  const rl = createInterface({ input: process.stdin });
  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line);
  }

  const scenario: Scenario = JSON.parse(lines.join("\n"));
  const { customer, steps } = scenario;

  const results: unknown[] = [];
  const policyStates = new Map<number, PolicyState>();
  let contractNumber = 0;

  for (const step of steps) {
    const stepIndex = results.length;
    if (step.op === "quote") {
      contractNumber++;
      const premium = quote(customer, step.items, contractNumber);
      const insuranceSum = step.items.reduce(
        (sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0),
        0
      );
      policyStates.set(stepIndex, {
        policy: { insuranceSum },
        remainingCap: insuranceSum * 2,
      });
      results.push({ premium });
    } else {
      const state = policyStates.get(step.policy)!;
      const { payout, remainingCap } = claim(state.policy, step.incident, state.remainingCap);
      state.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
};

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
