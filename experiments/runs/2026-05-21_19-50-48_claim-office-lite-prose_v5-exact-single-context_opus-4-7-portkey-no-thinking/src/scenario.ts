import { quote, type Item } from "./quote.js";
import { claim, type Incident } from "./claim.js";

interface ScenarioCustomer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: ScenarioCustomer;
  steps: Step[];
}

interface QuoteResultOut { premium: number }
interface ClaimResultOut { payout: number }

export interface ScenarioOutput {
  results: Array<QuoteResultOut | ClaimResultOut>;
}

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const results: Array<QuoteResultOut | ClaimResultOut> = [];
  const policies = new Map<number, { items: Item[] }>();
  let contractCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const r = quote(
        { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, contractCount },
        step.items
      );
      results.push({ premium: r.premium });
      policies.set(i, { items: step.items });
      contractCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy index ${step.policy}`);
      const r = claim(policy, step.incident);
      results.push({ payout: r.payout });
    }
  }

  return { results };
};
