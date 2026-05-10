import { validateItemType } from './items.js';

export interface PolicyItem {
  type: string;
}

export interface Policy {
  items: PolicyItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
  material?: string;
  enchantment?: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;

/**
 * Processes a claim against a policy.
 * Returns the payout and updated remaining cap.
 * Mutates policy.remainingCap.
 */
export function processClaim(policy: Policy, damages: DamageEntry[]): ClaimResult {
  // Validate all damage entries
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    validateItemType(damage.itemType);
  }

  // Validate that each damage item type is covered and not over-claimed
  const policyCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyCounts.set(item.type, (policyCounts.get(item.type) ?? 0) + 1);
  }

  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }

  for (const [type, count] of damageCounts) {
    const covered = policyCounts.get(type) ?? 0;
    if (covered === 0) {
      throw new Error(`Item type not covered by policy: ${type}`);
    }
    if (count > covered) {
      throw new Error(`More damage entries (${count}) than insured items (${covered}) for type: ${type}`);
    }
  }

  // Compute payout for each damage entry
  let totalRawPayout = 0;
  for (const damage of damages) {
    const rawPayout = computeItemPayout(damage);
    totalRawPayout += rawPayout;
  }

  // Apply cap
  const cappedPayout = Math.min(totalRawPayout, policy.remainingCap);

  // Round down (floor) in MHPCO's favor
  const finalPayout = Math.floor(cappedPayout);

  // Update remaining cap
  policy.remainingCap = Math.max(0, policy.remainingCap - finalPayout);

  return {
    payout: finalPayout,
    remainingCap: policy.remainingCap,
  };
}

function computeItemPayout(damage: DamageEntry): number {
  const enchantment = damage.enchantment ?? 0;
  const material = damage.material ?? '';

  // Both high-enchantment and dragon-material: 50% rule wins
  if (enchantment >= 8) {
    return damage.amount * 0.5 - DEDUCTIBLE;
  }

  // Dragon material only: full reimbursement
  if (material === 'dragon') {
    return damage.amount - DEDUCTIBLE;
  }

  // Standard: full reimbursement
  return damage.amount - DEDUCTIBLE;
}
