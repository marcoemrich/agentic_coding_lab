import { quote, claim, Customer, Item, Incident } from "./claim-office.js";

interface QuoteStep {
  op: string;
  items: Item[];
}

interface ClaimStep {
  op: string;
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

type Result = { premium: number } | { payout: number; remainingCap: number };

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const { customer, steps } = scenario;
  const results: Result[] = [];
  const priorPayoutsByPolicy = new Map<number, number>();
  let contractIndex = 0;

  steps.forEach((step) => {
    if (isQuoteStep(step)) {
      results.push({ premium: quote(customer, step.items, contractIndex) });
      contractIndex += 1;
    } else {
      const policyStep = steps[step.policy] as QuoteStep;
      const priorPayouts = priorPayoutsByPolicy.get(step.policy) ?? 0;
      const result = claim(policyStep.items, step.incident, priorPayouts);
      priorPayoutsByPolicy.set(step.policy, priorPayouts + result.payout);
      results.push(result);
    }
  });

  return { results };
};
