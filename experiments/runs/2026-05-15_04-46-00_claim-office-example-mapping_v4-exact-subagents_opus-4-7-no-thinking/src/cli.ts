// cli.ts
import { readFileSync } from "node:fs";
import { runScenario, KNOWN_ITEM_TYPES } from "./claim-office.js";

function failWith(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function countByType(entries: { type: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.type, (counts.get(entry.type) ?? 0) + 1);
  }
  return counts;
}

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);

const items: { type: string }[] = scenario.items ?? [];
for (const item of items) {
  if (!KNOWN_ITEM_TYPES.has(item.type)) {
    failWith(`unknown item type: ${item.type}`);
  }
}

if (scenario.command === "claim") {
  const damages: { type: string; amount: number }[] = scenario.damages ?? [];
  for (const damage of damages) {
    if (damage.amount < 0) {
      failWith("negative damage amount");
    }
  }
  const policyCounts = countByType(items);
  const damageCounts = countByType(damages);
  for (const [type, count] of damageCounts) {
    if (!policyCounts.has(type)) {
      failWith(`damage type ${type} not in the policy`);
    }
    if (count > (policyCounts.get(type) ?? 0)) {
      failWith(`more damage entries of type ${type} than the policy covers`);
    }
  }
}

const result = runScenario(scenario);
process.stdout.write(JSON.stringify(result) + "\n");
