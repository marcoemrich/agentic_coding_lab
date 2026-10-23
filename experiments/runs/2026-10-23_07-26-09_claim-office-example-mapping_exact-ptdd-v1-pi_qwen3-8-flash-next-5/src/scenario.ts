import { quotePremium, insuranceValueOf, type QuoteItem } from "./premium.js";
import { createPolicy, processClaim, type InsuredItem, type Policy, type Damage } from "./claims.js";

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export interface Execution {
  exitCode: number;
  stdout: string;
  stderr: string;
  results: StepResult[];
}

interface QuoteStepInput {
  op: "quote";
  items: QuoteItem[];
}

interface ClaimStepInput {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export function execute(input: unknown): Execution {
  try {
    const results = runScenario(input as ScenarioInput);
    return { exitCode: 0, stdout: JSON.stringify({ results }), stderr: "", results };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { exitCode: 1, stdout: "", stderr: message + "\n", results: [] };
  }
}

export function runScenario(input: ScenarioInput): StepResult[] {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quotesProcessed = 0;
  for (const step of input.steps) {
    if ((step as { op: string }).op === "quote") {
      const s = step as QuoteStepInput;
      results.push({
        premium: quotePremium({
          items: s.items,
          yearsWithMHPCO: input.customer.yearsWithMHPCO,
          followUpContract: quotesProcessed > 0,
        }),
      });
      const insured: InsuredItem[] = s.items.map((item) => ({
        type: item.type,
        insuranceValue: insuranceValueOf(item.type),
        enchantment: item.enchantment ?? 0,
        material: item.material ?? "",
      }));
      policies.push(createPolicy(insured));
      quotesProcessed += 1;
    } else {
      const s = step as ClaimStepInput;
      const outcome = processClaim(policies[s.policy], s.incident.damages);
      results.push(outcome);
    }
  }
  return results;
}
