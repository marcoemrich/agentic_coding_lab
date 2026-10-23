import { ClaimOfficeError } from "./claim-office-error.js";
import type { Item } from "./premium.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface DamagedItem {
  damage: Damage;
  item: Item;
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new ClaimOfficeError(`Damage amount must not be negative: ${damage.amount}`);
  }
}

export function matchDamagesToItems(damages: Damage[], insuredItems: Item[]): DamagedItem[] {
  const undamagedItems = [...insuredItems];
  return damages.map((damage) => {
    rejectNegativeAmount(damage);
    const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimOfficeError(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = undamagedItems.splice(index, 1);
    return { damage, item };
  });
}
