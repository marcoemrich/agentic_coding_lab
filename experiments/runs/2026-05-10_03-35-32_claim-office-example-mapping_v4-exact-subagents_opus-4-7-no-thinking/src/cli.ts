import { readFileSync } from "node:fs";
import { quote, claim } from "./claim-office.js";

type Step = any;

const KNOWN_ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

function validateItems(items: Step[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function executeQuote(step: Step, years: number): any {
  validateItems(step.items);
  return quote({ items: step.items, years, priorContract: false });
}

function validateDamageEntries(damages: Step[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

function countByKey<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function validateDamagesAgainstPolicy(damages: Step[], policyItems: Step[]): void {
  const policyCounts = countByKey(policyItems, (i: any) => i.type);
  const damageCounts = countByKey(damages, (d: any) => d.itemType);
  for (const type of Object.keys(damageCounts)) {
    if (!(type in policyCounts)) {
      throw new Error(`Damage references item not in policy: ${type}`);
    }
    if (damageCounts[type] > policyCounts[type]) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
}

function executeClaim(step: Step, steps: Step[]): any {
  const referencedQuote = steps[step.policy];
  validateDamageEntries(step.incident.damages);
  validateDamagesAgainstPolicy(step.incident.damages, referencedQuote.items);
  return claim({ policy: { items: referencedQuote.items }, incident: step.incident });
}

function executeStep(step: Step, steps: Step[], years: number): any {
  if (step.op === "claim") {
    return executeClaim(step, steps);
  }
  return executeQuote(step, years);
}

try {
  const scenario = JSON.parse(readFileSync(0, "utf-8"));
  const years = scenario.customer.yearsWithMHPCO;
  const steps: Step[] = scenario.steps;
  const results = steps.map((step) => executeStep(step, steps, years));
  process.stdout.write(JSON.stringify({ results }));
} catch (e: any) {
  process.stderr.write(`Error: ${e.message}\n`);
  process.exit(1);
}
