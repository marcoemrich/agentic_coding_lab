interface CoveredItem {
  type: string;
}

interface ReportedDamage {
  itemType: string;
}

export interface InsuredDamage<
  Item extends CoveredItem = CoveredItem,
  Damage extends ReportedDamage = ReportedDamage,
> {
  item: Item;
  damage: Damage;
}

export function matchDamageOccurrencesToInsuredItems<
  Item extends CoveredItem,
  Damage extends ReportedDamage,
>(insuredItems: Item[], damages: Damage[]): InsuredDamage<Item, Damage>[] {
  const availableItems = [...insuredItems];
  return damages.map((damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage exceeds insured ${damage.itemType} count`);
    const [item] = availableItems.splice(itemIndex, 1);
    return { item, damage };
  });
}
