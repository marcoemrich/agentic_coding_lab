/**
 * MHPCO Claim Office - quote and claim processing logic.
 */

/** Processing fee applied to every quote (in G). */
const PROCESSING_FEE = 5;

/** Surcharge rate for cursed items (fraction of item base premium). */
const CURSED_SURCHARGE_RATE = 0.5;

/** Surcharge rate for items with enchantment ≥5 (fraction of item base premium). */
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

/** Enchantment threshold for the high-enchantment surcharge. */
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/** First insurance surcharge rate (fraction of base premium). */
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/** Loyalty discount rate for customers with ≥2 years with MHPCO (fraction of base premium). */
const LOYALTY_DISCOUNT_RATE = 0.2;

/** Follow-up contract discount rate (fraction of base premium). */
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

/** Insurance values per item type (in G). */
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** Base premium amounts per item type (in G). Raw per-item price. */
const ITEM_BASE_PRICE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** Item types eligible for block discounts (components). */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** All valid item types. */
const VALID_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

/** Number of alike components needed for a block discount. */
const COMPONENTS_PER_BLOCK = 3;

/** Saving per component when block-discount applies (in G). */
const BLOCK_SAVING_PER_ITEM = 5;

/** An insurable item. */
type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

/**
 * Quote: compute the premium for a list of items for a given customer state.
 * Returns the total premium in G (integer).
 */
export function quote(
  items: Item[],
  customerContext: { yearsWithMHPCO: number; contractsSoFar: number }
): number {
  const typeCounts: Record<string, number> = {};
  let totalBasePremium = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (!VALID_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    const itemBase = ITEM_BASE_PRICE[item.type] ?? 0;
    totalBasePremium += itemBase;
    // Cursed: surcharge on item's base premium
    if (item.cursed) {
      itemSurcharges += itemBase * CURSED_SURCHARGE_RATE;
    }
    // High enchantment: surcharge on item's base premium
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      itemSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    if (COMPONENT_TYPES.has(item.type)) {
      typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1;
    }
  }

  // Block savings: each block of alike components costs (n*25 - n*5) instead of n*25
  let blockSavings = 0;
  for (const ct of COMPONENT_TYPES) {
    const count = typeCounts[ct] ?? 0;
    if (count % COMPONENTS_PER_BLOCK === 0) {
      blockSavings += count * BLOCK_SAVING_PER_ITEM;
    }
  }
  const basePremium = totalBasePremium - blockSavings;

  // Insurance surcharge: 10% on base premium (applies to every quote)
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

  // Loyalty discount: 20% off base premium for customers with ≥2 years
  let loyaltyDiscount = 0;
  if (customerContext.yearsWithMHPCO >= 2) {
    loyaltyDiscount = basePremium * LOYALTY_DISCOUNT_RATE;
  }

  // Follow-up contract discount: 15% off base premium for non-first contracts
  let followUpDiscount = 0;
  if (customerContext.contractsSoFar > 0) {
    followUpDiscount = basePremium * FOLLOW_UP_DISCOUNT_RATE;
  }

  const rawPremium = basePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  // Round up (MHPCO's favor) to nearest whole G
  return Math.ceil(rawPremium);
}

/**
 * Process a claim against an existing policy.
 * Returns { payout: number, remainingCap: number }.
 */
export function processClaim(
  policy: { items: Record<string, unknown>[]; insuranceSum: number; remainingCap?: number },
  damages: { itemType: string; amount: number }[]
): { payout: number; remainingCap: number } {
  // Validate damages
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!VALID_ITEM_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type in claim: ${damage.itemType}`);
    }
  }
  
  // Check that damages don't exceed policy coverage per type
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
  }
  const policyTypeCounts: Record<string, number> = {};
  for (const item of policy.items) {
    const t = item.type as string;
    policyTypeCounts[t] = (policyTypeCounts[t] ?? 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if ((policyTypeCounts[itemType] ?? 0) < count) {
      throw new Error(`More damages for ${itemType} than covered by policy`);
    }
  }
  
  const cap = policy.remainingCap ?? (policy.insuranceSum * 2);
  const DEDUCTIBLE = 100;
  
  let totalPayout = 0;
  for (const damage of damages) {
    // Find the policy item matching this damage
    const policyItem = policy.items.find((i: Record<string, unknown>) => i.type === damage.itemType);
    let reimbursableAmount = damage.amount;
    
    if (policyItem) {
      const enchantment = (policyItem as Record<string, unknown>).enchantment as number;
      
      // Enchantment ≥8: 50% reimbursement (applies first if both clauses)
      if (enchantment !== undefined && enchantment >= 8) {
        reimbursableAmount *= 0.5;
      }
    }
    
    const reimbursement = Math.max(0, reimbursableAmount - DEDUCTIBLE);
    totalPayout += reimbursement;
  }
  
  const cappedPayout = Math.min(totalPayout, cap);
  const newRemainingCap = cap - cappedPayout;
  
  return {
    payout: Math.floor(cappedPayout),
    remainingCap: newRemainingCap,
  };
}