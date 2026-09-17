export function takeCoveredItem<Item extends { type: string }>(
  itemType: string,
  availableItems: Item[],
): Item {
  const itemIndex = availableItems.findIndex((item) => item.type === itemType);
  if (itemIndex < 0) throw new Error(`Damage item is not covered: ${itemType}`);
  const [item] = availableItems.splice(itemIndex, 1);
  return item;
}
