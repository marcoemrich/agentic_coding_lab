import type { Item } from './item.js';

// Each damage consumes the next matching occurrence in quote order for this incident.
export function consumeNextInsuredOccurrence(availableItems: Item[], itemType: string): Item {
  const index = availableItems.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`No insured occurrence for ${itemType}`);
  const [item] = availableItems.splice(index, 1);
  return item;
}
