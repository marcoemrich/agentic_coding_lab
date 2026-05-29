import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { quote, claim, type QuoteInput, type ClaimInput } from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: QuoteInput["items"];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: ClaimInput["incident"];
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

function assertKnownItemTypes(items: { type: string }[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

function assertDamagesValid(
  policyItems: { type: string }[],
  damages: { itemType: string; amount: number }[],
): void {
  const coverageCounts = countByType(policyItems.map((item) => item.type));
  for (const damage of damages) {
    if (!coverageCounts.has(damage.itemType)) {
      throw new Error(
        `Claim damages an item not in policy: ${damage.itemType}`,
      );
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damageCounts = countByType(damages.map((damage) => damage.itemType));
  for (const [itemType, count] of damageCounts) {
    if (count > (coverageCounts.get(itemType) ?? 0)) {
      throw new Error(`Too many damages for item type: ${itemType}`);
    }
  }
}

export function runScenario(scenario: Scenario): { results: unknown[] } {
  const results: unknown[] = [];
  let quoteCount = 0;
  const remainingCaps = new Map<number, number>();
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const premium = quote({
        customer: {
          yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
          previousContracts: quoteCount,
        },
        items: step.items,
      });
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy];
      if (policyStep?.op !== "quote") {
        throw new Error(`Claim references a non-quote policy: ${step.policy}`);
      }
      assertDamagesValid(policyStep.items, step.incident.damages);
      const { payout, remainingCap = 0 } = claim({
        items: policyStep.items,
        incident: step.incident,
        remainingCap: remainingCaps.get(step.policy),
      });
      remainingCaps.set(step.policy, remainingCap);
      results.push({ payout, remainingCap });
    }
  }
  return { results };
}

function main(): void {
  try {
    const scenario = JSON.parse(readFileSync(0, "utf-8"));
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    process.stderr.write(String(error));
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
