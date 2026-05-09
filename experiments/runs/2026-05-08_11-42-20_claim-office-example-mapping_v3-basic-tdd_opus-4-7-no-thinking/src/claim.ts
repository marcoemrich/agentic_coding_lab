import {
  Item,
  Damage,
  Incident,
  itemInsuranceValue,
  isMainItem,
  MainItem,
  ItemType,
} from './types.js';

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function makePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((s, it) => s + itemInsuranceValue(it), 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

/**
 * Compute the payout (before deductible, before cap) for a single damage entry,
 * given the matching insured item.
 */
function reimburseAmount(item: Item, damageAmount: number): number {
  if (isMainItem(item)) {
    const main = item as MainItem;
    const isHighEnchantment = main.enchantment !== undefined && main.enchantment >= 8;
    const isDragon = main.material === 'dragon';

    if (isHighEnchantment) {
      // 50% rule wins over dragon when both apply
      return damageAmount * 0.5;
    }
    if (isDragon) {
      return damageAmount; // full reimbursement
    }
    return damageAmount;
  }
  // Components: full reimbursement (no enchantment / material).
  return damageAmount;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Validate damages
  for (const d of incident.damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  }

  // Verify each damage entry has a matching insured item.
  // Multiple entries of same type require multiple insured items of that type.
  const itemTypeCounts = new Map<ItemType, number>();
  for (const it of policy.items) {
    itemTypeCounts.set(it.type, (itemTypeCounts.get(it.type) || 0) + 1);
  }
  const damageTypeCounts = new Map<ItemType, number>();
  for (const d of incident.damages) {
    damageTypeCounts.set(d.itemType, (damageTypeCounts.get(d.itemType) || 0) + 1);
  }
  for (const [t, c] of damageTypeCounts) {
    const insured = itemTypeCounts.get(t) || 0;
    if (insured === 0) {
      throw new Error(`Damage references item type "${t}" not in policy`);
    }
    if (c > insured) {
      throw new Error(
        `More damages of type "${t}" (${c}) than items insured (${insured})`
      );
    }
  }

  // Sum payouts (per-damage deductible, fractional intermediate).
  let totalRaw = 0;
  for (const d of incident.damages) {
    const item = policy.items.find((it) => it.type === d.itemType);
    if (!item) {
      // shouldn't happen due to checks above
      throw new Error(`No matching item for damage of type ${d.itemType}`);
    }
    const reimbursed = reimburseAmount(item, d.amount);
    const afterDeductible = Math.max(0, reimbursed - 100);
    totalRaw += afterDeductible;
  }

  // Round down (in MHPCO favor for payout).
  let payout = Math.floor(totalRaw);

  // Cap: payout cannot exceed remaining cap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
