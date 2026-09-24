import { capClaimPayout, policyPayoutCap } from './claim-cap.js';
import { assertNonnegativeDamage, damagePayout } from './claim-damage.js';

type Item = { type: string; material?: string; enchantment?: number };
type Damage = { itemType: string; amount: number };

function takeInsuredItem(available: Item[], itemType: string): Item {
  const index = available.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`Damage item not insured: ${itemType}`);
  const [item] = available.splice(index, 1);
  return item;
}

function incidentPayout(items: Item[], damages: Damage[]): number {
  const available = [...items];
  return damages.reduce((sum, damage) => {
    assertNonnegativeDamage(damage);
    const item = takeInsuredItem(available, damage.itemType);
    return sum + damagePayout(item, damage);
  }, 0);
}

export function processClaim(items: Item[], damages: Damage[], remainingCap = policyPayoutCap(items)) {
  return capClaimPayout(incidentPayout(items, damages), remainingCap);
}
