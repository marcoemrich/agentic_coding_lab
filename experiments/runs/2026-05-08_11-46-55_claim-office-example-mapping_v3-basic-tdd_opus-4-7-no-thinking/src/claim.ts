import {
  Item,
  Incident,
  Damage,
  DEDUCTIBLE,
  isMainItem,
  isComponent,
  isKnownItem,
  itemInsuranceValue,
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

export function createPolicy(items: Item[]): Policy {
  for (const it of items) {
    if (!isKnownItem(it.type)) {
      throw new Error(`Unknown item type: ${it.type}`);
    }
  }
  const insuranceSum = items.reduce((s, it) => s + itemInsuranceValue(it.type), 0);
  return {
    items,
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
  };
}

/**
 * Round payout down (MHPCO's favor for payouts).
 */
function roundPayout(value: number): number {
  return Math.floor(value + 1e-9);
}

function computeDamagePayout(item: Item, amount: number): number {
  // Apply special clauses, then deductible.
  let reimbursable = amount;

  const isDragon = item.material === 'dragon';
  const isHighEnch = (item.enchantment ?? 0) >= 8;

  if (isHighEnch) {
    reimbursable = 0.5 * reimbursable;
  } else if (isDragon) {
    // full reimbursement: keep as-is
    reimbursable = reimbursable;
  }
  // If neither, full reimbursement minus deductible (default).

  const afterDeductible = reimbursable - DEDUCTIBLE;
  return Math.max(0, afterDeductible);
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Validate damages
  // 1. Each damage must reference a known item type that is in the policy.
  // 2. Number of damages of a given type must not exceed the count of insured items of that type.
  // 3. Each damage amount must be non-negative.

  const damageCountsByType: Record<string, number> = {};
  for (const d of incident.damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    if (!isKnownItem(d.itemType)) {
      throw new Error(`Unknown item type in damage: ${d.itemType}`);
    }
    damageCountsByType[d.itemType] = (damageCountsByType[d.itemType] ?? 0) + 1;
  }

  // Build map of insured item counts by type
  const insuredCountsByType: Record<string, number> = {};
  for (const it of policy.items) {
    insuredCountsByType[it.type] = (insuredCountsByType[it.type] ?? 0) + 1;
  }

  // Validate: each damaged type must be insured, with enough count
  for (const [type, count] of Object.entries(damageCountsByType)) {
    const insured = insuredCountsByType[type] ?? 0;
    if (insured === 0) {
      throw new Error(`Damaged item type not insured: ${type}`);
    }
    if (count > insured) {
      throw new Error(`Too many damages for ${type}: ${count} > ${insured}`);
    }
  }

  // Compute total payout: each damage processed individually with deductible.
  // For matching items: use the first insured item of that type (representative attributes).
  // Since insured item identity matters (material/ench), we map damages to items in order.
  // Use a copy of items per type to map damages.
  const remainingByType: Record<string, Item[]> = {};
  for (const it of policy.items) {
    if (!remainingByType[it.type]) remainingByType[it.type] = [];
    remainingByType[it.type].push(it);
  }

  // For each damage, pick the next item of that type (FIFO) and use its attributes.
  // Track index per type
  const indexByType: Record<string, number> = {};

  let totalPayout = 0;
  for (const d of incident.damages) {
    const idx = indexByType[d.itemType] ?? 0;
    const item = remainingByType[d.itemType][idx];
    indexByType[d.itemType] = idx + 1;
    const p = computeDamagePayout(item, d.amount);
    totalPayout += p;
  }

  // Round payout down
  let finalPayout = roundPayout(totalPayout);

  // Apply remaining cap
  if (finalPayout > policy.remainingCap) {
    finalPayout = policy.remainingCap;
  }

  policy.remainingCap -= finalPayout;

  return {
    payout: finalPayout,
    remainingCap: policy.remainingCap,
  };
}
