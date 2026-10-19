// CLI runner: reads scenario from stdin, processes steps, writes results to stdout
import { calculatePremium, type Item, type Customer } from "./quote.js";
import { processClaim, type Policy, type Incident } from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type Result = QuoteResult | ClaimResult;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResult {
  results: Result[];
}

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: Result[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      // A quote is the first contract iff no policies have been issued yet.
      const premium = calculatePremium(
        step.items,
        scenario.customer,
        policies.length === 0,
      );
      policies.push({ items: step.items, totalPayoutsSoFar: 0 });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`No policy at index ${step.policy}`);
      }
      const claimResult = processClaim(policy, step.incident);
      policy.totalPayoutsSoFar += claimResult.payout;
      results.push({
        payout: claimResult.payout,
        remainingCap: claimResult.remainingCap,
      });
    }
  }
  return { results };
};

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) {
    input += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk as Uint8Array);
  }
  return input;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
};

// Run main only when this module is the entry point (not when imported by tests).
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  void main();
}
