import type { Item } from './item.js';
import { validDamageAmount, type Damage } from './damage.js';
function takeInsuredItemForDamage(items: Item[], damage: Damage): Item {
  const index = items.findIndex(item => item.type === damage.itemType);
  if (index < 0) throw new Error(`Item not insured: ${damage.itemType}`);
  return items.splice(index, 1)[0];
}
export function coveredDamages(items: Item[], damages: Damage[]) {
  const availableItems = [...items];
  return damages.map(damage => {
    const amount = validDamageAmount(damage);
    return { item: takeInsuredItemForDamage(availableItems, damage), amount };
  });
}
