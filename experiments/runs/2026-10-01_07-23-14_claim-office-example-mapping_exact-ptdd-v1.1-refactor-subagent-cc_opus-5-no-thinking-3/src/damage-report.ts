import type { Item } from "./price-list.js";

// What a claimant reports: how much damage an item of a given type took.
export interface Damage {
  itemType: string;
  amount: number;
}

// A reported damage once the office has decided which covered item answers
// for it: the amount to value, bound to the item it will be valued against.
export interface SettledDamage {
  damagedItem: Item;
  amount: number;
}

// Whether the office admits the reports at all, before it asks which items
// answer for them. A damage report states how much damage an item took, so a
// negative amount is not a reduced payout but a report the office refuses.
// The office refuses the whole claim, so every report is admitted before any
// is settled. Further admissibility rules belong here, alongside this one.
export function admitDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `A damage amount cannot be negative, but "${damage.itemType}" reports ${damage.amount}`,
      );
    }
  }
}

// Which covered item answers for each reported damage. The office only settles
// damage to items it actually covers, and each covered item answers for at
// most one damage, so a type outside the policy -- or reported more often
// than the policy covers it -- is not a smaller payout but a claim it refuses.
export function settledDamagesOf(
  items: Item[],
  damages: Damage[],
): SettledDamage[] {
  const unclaimedItems = [...items];
  return damages.map((damage) => {
    const index = unclaimedItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    if (index === -1) {
      throw new Error(
        `The policy does not cover an item of type "${damage.itemType}"`,
      );
    }
    return {
      damagedItem: unclaimedItems.splice(index, 1)[0],
      amount: damage.amount,
    };
  });
}
