import type { DamageInput, ItemInput } from "./scenario.js";
import { isComponent } from "./component.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const PERCENT_BASE = 100;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HEAVILY_ENCHANTED_MIN_LEVEL = 8;
const HEAVILY_ENCHANTED_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

function insuranceValueOf(item: ItemInput): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return INSURANCE_VALUES[item.type];
}

export function insuranceCapOf(items: ItemInput[]): number {
  return (
    CAP_MULTIPLIER *
    items.reduce((sum, item) => sum + insuranceValueOf(item), 0)
  );
}

function insuredItemFor(
  damage: DamageInput,
  items: ItemInput[],
): ItemInput | undefined {
  return items.find((item) => item.type === damage.itemType);
}

function insuredCountOf(items: ItemInput[], itemType: string): number {
  return items.filter((item) => item.type === itemType).length;
}

function assertDamagesMatchInsuredItems(
  damages: DamageInput[],
  insuredItems: ItemInput[],
): void {
  for (const damage of damages) {
    const entriesOfSameType = damages.filter(
      (other) => other.itemType === damage.itemType,
    ).length;
    if (entriesOfSameType > insuredCountOf(insuredItems, damage.itemType)) {
      throw new Error(
        `damages contain ${entriesOfSameType} entries of type "${damage.itemType}" but only ${insuredCountOf(insuredItems, damage.itemType)} are insured`,
      );
    }
  }
}

function isHeavilyEnchanted(item: ItemInput): boolean {
  return (item.enchantment ?? 0) >= HEAVILY_ENCHANTED_MIN_LEVEL;
}

function reimbursementPercent(insuredItem: ItemInput | undefined): number {
  // Heavily enchanted items are reimbursed at 50 %; this clause wins when
  // dragon material also applies. Dragon-material and all other items are
  // fully reimbursed.
  if (insuredItem !== undefined && isHeavilyEnchanted(insuredItem)) {
    return HEAVILY_ENCHANTED_REIMBURSEMENT_PERCENT;
  }
  return FULL_REIMBURSEMENT_PERCENT;
}

function reimbursedAmount(
  damage: DamageInput,
  insuredItem: ItemInput | undefined,
): number {
  return (damage.amount * reimbursementPercent(insuredItem)) / PERCENT_BASE;
}

function assertNoNegativeDamageAmounts(damages: DamageInput[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `damage amount ${damage.amount} for item type "${damage.itemType}" is negative`,
      );
    }
  }
}

function assertValidClaim(damages: DamageInput[], insuredItems: ItemInput[]): void {
  assertDamagesMatchInsuredItems(damages, insuredItems);
  assertNoNegativeDamageAmounts(damages);
}

export function processDamages(
  damages: DamageInput[],
  insuredItems: ItemInput[],
  capRemaining: number,
): ClaimOutcome {
  assertValidClaim(damages, insuredItems);
  const reimbursedTotal = damages
    .map(
      (damage) =>
        reimbursedAmount(damage, insuredItemFor(damage, insuredItems)) -
        DEDUCTIBLE,
    )
    .reduce((sum, entry) => sum + entry, 0);
  const payout = Math.floor(Math.min(reimbursedTotal, capRemaining));
  return { payout, remainingCap: capRemaining - payout };
}
