import type { Item } from "./price-list.js";

export type Damage = { itemType: string; amount: number };

export type DamagedItem = { item: Item; damageAmount: number };

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeCoveredItem(undamagedItems: Item[], itemType: string): Item {
  const position = undamagedItems.findIndex((item) => item.type === itemType);
  if (position < 0) {
    throw new Error(`Damaged item is not covered by the policy: ${itemType}`);
  }
  return undamagedItems.splice(position, 1)[0];
}

export function coveredDamages(insuredItems: Item[], damages: Damage[]): DamagedItem[] {
  damages.forEach(rejectNegativeAmount);
  const undamagedItems = [...insuredItems];
  return damages.map((damage) => ({
    item: takeCoveredItem(undamagedItems, damage.itemType),
    damageAmount: damage.amount,
  }));
}
