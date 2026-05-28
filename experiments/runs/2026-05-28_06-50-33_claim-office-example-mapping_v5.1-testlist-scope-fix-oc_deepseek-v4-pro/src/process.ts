import { calculatePremium } from "./quote.js";
import { calculateInsuranceSum, processClaim } from "./claim.js";

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type Result = QuoteResult | ClaimResult;

const KNOWN_ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

export function processScenario(scenario: Scenario): Result[] {
  const policies: { items: Item[]; insuranceSum: number; remainingCap: number }[] = [];
  const results: Result[] = [];
  let contractNumber = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      contractNumber++;
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.includes(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const premium = calculatePremium(step.items, scenario.customer, contractNumber);
      const insuranceSum = calculateInsuranceSum(step.items);
      policies.push({
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy at index ${step.policy} not found`);
      }
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }
      const result = processClaim(policy.items, policy.insuranceSum, policy.remainingCap, step.incident.damages);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  return results;
}