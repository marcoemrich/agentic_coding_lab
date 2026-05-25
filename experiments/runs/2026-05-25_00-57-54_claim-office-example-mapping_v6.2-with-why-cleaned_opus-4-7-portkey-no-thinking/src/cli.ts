import { readFileSync } from "node:fs";
import { runScenario, type ClaimStep, type Scenario } from "./claim-office.js";

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

type ClaimWithPolicyItemTypes = { claim: ClaimStep; insuredItemTypes: string[] };

const claimsWithInsuredItemTypes = (scenario: Scenario): ClaimWithPolicyItemTypes[] => {
  const policyItemTypes: string[][] = [];
  const claims: ClaimWithPolicyItemTypes[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      policyItemTypes.push(step.items.map((item) => item.type));
    } else {
      claims.push({ claim: step, insuredItemTypes: policyItemTypes[step.policy] ?? [] });
    }
  }
  return claims;
};

const countOccurrences = <T>(values: Iterable<T>): Map<T, number> => {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
};

const findUnknownItemTypeInQuote = (scenario: Scenario): string | undefined => {
  for (const step of scenario.steps) {
    if (step.op !== "quote") continue;
    for (const item of step.items) {
      if (!KNOWN_ITEM_TYPES.has(item.type)) return item.type;
    }
  }
  return undefined;
};

const findClaimAgainstUninsuredItem = (scenario: Scenario): string | undefined => {
  for (const { claim, insuredItemTypes } of claimsWithInsuredItemTypes(scenario)) {
    const insured = new Set(insuredItemTypes);
    for (const damage of claim.incident.damages) {
      if (!insured.has(damage.itemType)) return damage.itemType;
    }
  }
  return undefined;
};

const findNegativeDamageAmount = (scenario: Scenario): number | undefined => {
  for (const step of scenario.steps) {
    if (step.op !== "claim") continue;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) return damage.amount;
    }
  }
  return undefined;
};

const findExcessDamageType = (scenario: Scenario): string | undefined => {
  for (const { claim, insuredItemTypes } of claimsWithInsuredItemTypes(scenario)) {
    const insuredCounts = countOccurrences(insuredItemTypes);
    const damageCounts = countOccurrences(claim.incident.damages.map((d) => d.itemType));
    for (const [itemType, count] of damageCounts) {
      if (count > (insuredCounts.get(itemType) ?? 0)) return itemType;
    }
  }
  return undefined;
};

const die = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

type Validator = {
  find: (scenario: Scenario) => string | number | undefined;
  label: string;
};

const validators: Validator[] = [
  { find: findUnknownItemTypeInQuote, label: "Unknown item type" },
  { find: findClaimAgainstUninsuredItem, label: "Claim references item not in policy" },
  { find: findNegativeDamageAmount, label: "Negative damage amount" },
  { find: findExcessDamageType, label: "More damages than insured items of type" },
];

const scenario: Scenario = JSON.parse(readFileSync(0, "utf-8"));

for (const { find, label } of validators) {
  const offender = find(scenario);
  if (offender !== undefined) die(`${label}: ${offender}`);
}

process.stdout.write(JSON.stringify(runScenario(scenario)));
