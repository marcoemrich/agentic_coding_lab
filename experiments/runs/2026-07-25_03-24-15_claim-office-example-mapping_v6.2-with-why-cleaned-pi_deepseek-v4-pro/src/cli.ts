#!/usr/bin/env node
import { quote, processClaim } from "./claim-office.js";

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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
    damages: {
      itemType: string;
      amount: number;
    }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Input {
  customer: {
    yearsWithMHPCO: number;
  };
  steps: Step[];
}

/** Insurance values per item type (in G). */
const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

async function main(): Promise<void> {
  let raw = "";
  for await (const chunk of process.stdin) {
    raw += chunk;
  }

  let input: Input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.stderr.write("Error: Invalid JSON input\n");
    process.exit(1);
  }

  const results: unknown[] = [];
  const policies: { items: Item[]; insuranceSum: number; remainingCap: number }[] = [];
  let contractsSoFar = 0;

  for (const step of input.steps) {
    switch (step.op) {
      case "quote": {
        try {
          const premium = quote(step.items, {
            yearsWithMHPCO: input.customer.yearsWithMHPCO,
            contractsSoFar,
          });
          results.push({ premium });

          const insuranceSum = step.items.reduce((sum, item) => {
            const value = ITEM_INSURANCE_VALUES[item.type];
            if (value === undefined) {
              throw new Error(`Unknown item type: ${item.type}`);
            }
            return sum + value;
          }, 0);
          policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
          contractsSoFar++;
        } catch (e) {
          process.stderr.write(`Error: ${(e as Error).message}\n`);
          process.exit(1);
        }
        break;
      }
      case "claim": {
        const policy = policies[step.policy];
        if (!policy) {
          process.stderr.write(`Error: Policy at index ${step.policy} not found\n`);
          process.exit(1);
        }
        try {
          const claimResult = processClaim(policy, step.incident.damages);
          results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
          policy.remainingCap = claimResult.remainingCap;
        } catch (e) {
          process.stderr.write(`Error: ${(e as Error).message}\n`);
          process.exit(1);
        }
        break;
      }
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch((e) => {
  process.stderr.write(`Error: ${(e as Error).message}\n`);
  process.exit(1);
});