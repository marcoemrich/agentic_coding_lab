export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap?: number;
}

export interface ClaimInput {
  policy: Policy;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REDUCTION = 0.5;
const DRAGON_MATERIAL = 'dragon';
const CAP_MULTIPLIER = 2;

export function calculateClaim(input: ClaimInput): ClaimResult {
  const { policy, damages } = input;

  // Validate damages
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }

  // Count items by type
  const itemsByType: Record<string, Item[]> = {};
  for (const item of policy.items) {
    if (!itemsByType[item.type]) {
      itemsByType[item.type] = [];
    }
    itemsByType[item.type].push(item);
  }

  // Validate damages match insured items
  const damagesByType: Record<string, number> = {};
  for (const damage of damages) {
    damagesByType[damage.itemType] = (damagesByType[damage.itemType] || 0) + 1;
  }

  for (const [itemType, count] of Object.entries(damagesByType)) {
    if (!itemsByType[itemType]) {
      throw new Error(`Damage claim for uninsured item type: ${itemType}`);
    }
    if (count > itemsByType[itemType].length) {
      throw new Error(`Damage claim count (${count}) exceeds insured items (${itemsByType[itemType].length}) for type: ${itemType}`);
    }
  }

  // Calculate total payout
  let totalPayout = 0;
  const damageCounts: Record<string, number> = {};

  for (const damage of damages) {
    const item = itemsByType[damage.itemType][damageCounts[damage.itemType] || 0];
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;

    let reimbursement = damage.amount;

    // Apply special clauses
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      // High enchantment clause: 50% reduction
      reimbursement *= HIGH_ENCHANTMENT_REDUCTION;
    } else if (item.material === DRAGON_MATERIAL) {
      // Dragon material clause: full reimbursement (no reduction)
      // reimbursement stays as is
    }

    // Apply deductible
    reimbursement -= DEDUCTIBLE;

    // Ensure non-negative
    if (reimbursement < 0) {
      reimbursement = 0;
    }

    // Floor to nearest G
    reimbursement = Math.floor(reimbursement);

    totalPayout += reimbursement;
  }

  // Calculate cap
  const cap = policy.insuranceSum * CAP_MULTIPLIER;
  const remainingCapFromPolicy = policy.remainingCap !== undefined ? policy.remainingCap : cap;

  // Apply cap
  const actualPayout = Math.min(totalPayout, remainingCapFromPolicy);
  const newRemainingCap = remainingCapFromPolicy - actualPayout;

  return {
    payout: actualPayout,
    remainingCap: newRemainingCap,
  };
}
