#!/usr/bin/env node

import { readFileSync } from "fs";
import { calculatePremium, type Item } from "./premium.js";
import { calculatePayout, type PolicyItem } from "./claim.js";

const VALID_ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

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
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface Policy {
  items: PolicyItem[];
  insuranceSum: number;
  remainingCap: number;
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (!VALID_ITEM_TYPES.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    sum += INSURANCE_VALUES[item.type] || 0;
  }
  return sum;
}

function processScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];

    if (step.op === "quote") {
      for (const item of step.items) {
        if (!VALID_ITEM_TYPES.includes(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }

      const insuranceSum = computeInsuranceSum(step.items);
      const premium = calculatePremium(
        step.items,
        scenario.customer.yearsWithMHPCO,
        contractIndex,
      );

      const policy: Policy = {
        items: step.items.map((item) => ({
          type: item.type,
          material: item.material,
          enchantment: item.enchantment,
        })),
        insuranceSum,
        remainingCap: insuranceSum * 2,
      };

      policies.set(i, policy);
      results.push({ premium });
      contractIndex++;
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Policy not found at step ${step.policy}`);
      }

      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        if (!VALID_ITEM_TYPES.includes(damage.itemType)) {
          throw new Error(`Unknown item type in claim: ${damage.itemType}`);
        }
        const hasItem = policy.items.some((p) => p.type === damage.itemType);
        if (!hasItem) {
          throw new Error(`Item type ${damage.itemType} not in policy`);
        }
      }

      const { payout, remainingCap } = calculatePayout(
        policy.items,
        step.incident.damages,
        policy.insuranceSum,
        policy.remainingCap,
      );

      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  return results;
}

function main(): void {
  try {
    const input = readFileSync("/dev/stdin", "utf-8").trim();
    if (!input) {
      process.stderr.write("Empty input\n");
      process.exit(1);
    }

    const scenario: Scenario = JSON.parse(input);
    const results = processScenario(scenario);

    const output = JSON.stringify({ results });
    process.stdout.write(output + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

main();