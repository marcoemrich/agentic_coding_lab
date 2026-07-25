import { quote, type QuoteItem } from "./quote.js";
import { claim, type Policy, type Damage } from "./claim.js";

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type StepResult = QuoteResult | ClaimResult;
export interface QuoteResult {
  premium: number;
}
export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioOutput {
  results: StepResult[];
}

export function processScenario(input: ScenarioInput): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let contractNumber = 0;
  for (const step of input.steps) {
    if (step.op === "quote") {
      contractNumber++;
      const quoteResult = quote(step.items, input.customer, contractNumber);
      policies.push({
        items: step.items,
        insuranceSum: quoteResult.insuranceSum,
        cap: 2 * quoteResult.insuranceSum,
        remainingCap: 2 * quoteResult.insuranceSum,
        premium: quoteResult.premium,
      });
      results.push({ premium: quoteResult.premium });
    } else {
      const policy = policies[step.policy];
      if (policy === undefined) {
        throw new Error(`invalid policy index: ${step.policy}`);
      }
      const claimResult = claim({ policy, damages: step.incident.damages });
      policies[step.policy] = { ...policy, remainingCap: claimResult.remainingCap };
      results.push(claimResult);
    }
  }
  return { results };
}
