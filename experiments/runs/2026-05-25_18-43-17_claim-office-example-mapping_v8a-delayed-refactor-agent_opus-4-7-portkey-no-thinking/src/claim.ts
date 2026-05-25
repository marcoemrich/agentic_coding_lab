import { Policy, Incident, DamageEntry, Item, ClaimResult } from './types.js';
import { isKnownType } from './catalogue.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_FACTOR = 0.5;

function matchDamagesToItems(items: Item[], damages: DamageEntry[]): Item[] {
  const itemsByType: Record<string, Item[]> = {};
  for (const item of items) {
    if (!itemsByType[item.type]) itemsByType[item.type] = [];
    itemsByType[item.type].push(item);
  }
  const consumed: Record<string, number> = {};
  const matched: Item[] = [];
  for (const damage of damages) {
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown damaged item type: ${damage.itemType}`);
    }
    const available = itemsByType[damage.itemType];
    const used = consumed[damage.itemType] ?? 0;
    if (!available || used >= available.length) {
      throw new Error(
        `Damage references ${damage.itemType} not covered by the policy`
      );
    }
    matched.push(available[used]);
    consumed[damage.itemType] = used + 1;
  }
  return matched;
}

// Reimbursement factor per the spec:
//   - high enchantment (>= 8): 50% (wins over dragon when both apply)
//   - dragon material: 100%
//   - otherwise: 100%
function reimbursementFactor(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return HIGH_ENCHANTMENT_PAYOUT_FACTOR;
  }
  return 1;
}

function payoutForDamage(item: Item, amount: number): number {
  const reimbursable = amount * reimbursementFactor(item);
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

function validateDamageAmounts(damages: DamageEntry[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  validateDamageAmounts(incident.damages);
  const matchedItems = matchDamagesToItems(policy.items, incident.damages);

  let totalPayout = 0;
  for (let i = 0; i < incident.damages.length; i++) {
    totalPayout += payoutForDamage(matchedItems[i], incident.damages[i].amount);
  }

  // Round down in MHPCO's favor, then cap.
  const requested = Math.floor(totalPayout);
  const payout = Math.min(requested, policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
