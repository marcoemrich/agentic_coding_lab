// CLI entry point for the claim office.
import { readFileSync } from "node:fs";
import {
  quote,
  claim,
  type Customer,
  type Damage,
  type Item,
} from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer;
  steps: Step[];
};

const STDIN_FD = 0;
const scenario: Scenario = JSON.parse(readFileSync(STDIN_FD, "utf8"));

type Policy = { items: Item[]; remainingCap?: number };

const results: unknown[] = [];
const policies: Policy[] = [];

for (const step of scenario.steps) {
  if (step.op === "quote") {
    policies.push({ items: step.items });
    const premium = quote(scenario.customer, step.items, {
      contractNumber: policies.length,
    });
    results.push({ premium });
  } else {
    const policy = policies[step.policy];
    const result = claim(policy.items, step.incident.damages, {
      remainingCap: policy.remainingCap,
    });
    policy.remainingCap = result.remainingCap;
    results.push(result);
  }
}

process.stdout.write(JSON.stringify({ results }));
