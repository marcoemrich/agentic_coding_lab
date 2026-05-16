import { Item, Incident, isMainItem, MAIN_ITEMS, COMPONENT_VALUE } from './types.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item)) {
    return MAIN_ITEMS[item.type].value;
  }
  return COMPONENT_VALUE;
}

export function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}

function isHighEnchant(item: Item): boolean {
  return isMainItem(item) && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function isDragon(item: Item): boolean {
  return isMainItem(item) && item.material === 'dragon';
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Validate damages
  for (const d of incident.damages) {
    if (d.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${d.amount}`);
    }
  }

  // Group policy items by type
  const policyCounts: Record<string, Item[]> = {};
  for (const it of policy.items) {
    if (!policyCounts[it.type]) policyCounts[it.type] = [];
    policyCounts[it.type].push(it);
  }

  // Group damages by type
  const damageCounts: Record<string, number> = {};
  for (const d of incident.damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
  }

  // Validate damages reference covered items
  for (const [type, count] of Object.entries(damageCounts)) {
    const covered = policyCounts[type]?.length ?? 0;
    if (covered === 0) {
      throw new Error(`Item type ${type} not in policy`);
    }
    if (count > covered) {
      throw new Error(`Too many damage entries for ${type}: ${count} > ${covered}`);
    }
  }

  // Process each damage entry. For multiple items of same type, use them in order.
  const typeIndex: Record<string, number> = {};
  let totalPayout = 0;

  for (const d of incident.damages) {
    const idx = typeIndex[d.itemType] ?? 0;
    typeIndex[d.itemType] = idx + 1;
    const item = policyCounts[d.itemType][idx];

    let reimbursement: number;
    if (isHighEnchant(item)) {
      reimbursement = d.amount * 0.5;
    } else if (isDragon(item)) {
      reimbursement = d.amount;
    } else {
      reimbursement = d.amount;
    }

    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }

  // Round payout down (MHPCO's favor), then apply cap
  let payout = Math.floor(totalPayout);
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
