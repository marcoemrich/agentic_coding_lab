import type { Item } from "./item.js";

export interface Damage {
  itemType: string;
  amount: number;
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeInsuredItem(uninjured: Item[], damage: Damage): Item {
  const index = uninjured.findIndex(
    (candidate) => candidate.type === damage.itemType,
  );
  if (index === -1) {
    throw new Error(`Damaged item is not insured: ${damage.itemType}`);
  }
  return uninjured.splice(index, 1)[0];
}

export function matchDamagesToInsuredItems(
  items: Item[],
  damages: Damage[],
): { item: Item; damage: Damage }[] {
  const uninjured = [...items];
  return damages.map((damage) => {
    rejectNegativeAmount(damage);
    return { item: takeInsuredItem(uninjured, damage), damage };
  });
}
