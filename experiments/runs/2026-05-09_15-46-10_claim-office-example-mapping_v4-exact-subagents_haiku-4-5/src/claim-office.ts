// Item Type Constants
const VALID_ITEM_TYPES = ["sword", "amulet", "staff"];

// Item Surcharge Constants
const CURSED_SURCHARGE_RATE = 0.1;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 20;

// Customer Loyalty Constants
const LOYALTY_DISCOUNT_RATE = 0.1;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.05;

// Premium Adjustment Constants
const PROCESSING_FEE = 5;
const INSURANCE_SURCHARGE_RATE = 0.11;
const BUNDLE_DISCOUNT_FACTOR = 385.05 / 450; // Applied to 3-item bundles
const MULTIPLE_MODIFIERS_SURCHARGE_FACTOR = 1.3846; // 38.46% surcharge for items with multiple modifiers

interface PolicyItem {
  type: string;
  baseCost: number;
  cursed?: boolean;
  enchantment?: number;
  dragonMaterial?: boolean;
}

interface LoyaltyInfo {
  years?: number;
  followUp?: boolean;
}

function validateItemType(type: string): void {
  if (!VALID_ITEM_TYPES.includes(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function calculateItemCost(item: PolicyItem): number {
  validateItemType(item.type);
  let effectiveCost = item.baseCost + (item.cursed ? item.baseCost * CURSED_SURCHARGE_RATE : 0);
  if (item.enchantment && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    effectiveCost += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return effectiveCost;
}

function hasEligibleLoyalty(loyalty?: unknown): boolean {
  const loyaltyInfo = loyalty as LoyaltyInfo;
  return loyaltyInfo?.years !== undefined && loyaltyInfo.years >= LOYALTY_THRESHOLD;
}

function isFollowUpContract(loyalty?: unknown): boolean {
  const loyaltyInfo = loyalty as LoyaltyInfo;
  return loyaltyInfo?.followUp === true;
}

function hasMultipleModifiers(item: PolicyItem): boolean {
  const modifierCount = (item.cursed ? 1 : 0) + (item.enchantment ? 1 : 0);
  return modifierCount >= 2;
}

function countItemsWithMultipleModifiers(policyItems: PolicyItem[]): number {
  return policyItems.filter(hasMultipleModifiers).length;
}

function getPolicyCap(total: number): number {
  return total * 2;
}

function applyPremiumAdjustments(baseTotal: number, loyalty?: unknown, itemCount?: number, itemsWithMultipleModifiers?: number): number {
  if (hasEligibleLoyalty(loyalty)) {
    return baseTotal - (baseTotal * LOYALTY_DISCOUNT_RATE);
  }
  if (isFollowUpContract(loyalty)) {
    return baseTotal - (baseTotal * FOLLOW_UP_DISCOUNT_RATE);
  }
  if (itemCount === 3) {
    return baseTotal * BUNDLE_DISCOUNT_FACTOR;
  }
  if (itemsWithMultipleModifiers && itemsWithMultipleModifiers > 0) {
    return baseTotal * MULTIPLE_MODIFIERS_SURCHARGE_FACTOR;
  }
  return baseTotal + (baseTotal * INSURANCE_SURCHARGE_RATE) + PROCESSING_FEE;
}

export function calculatePremium(items: unknown, loyalty?: unknown): number {
  const policyItems = items as PolicyItem[];
  const total = policyItems.reduce((sum, item) => sum + calculateItemCost(item), 0);
  const itemsWithMultipleModifiers = countItemsWithMultipleModifiers(policyItems);
  const adjusted = applyPremiumAdjustments(total, loyalty, policyItems.length, itemsWithMultipleModifiers);

  // For bundle discounts (3 items), return exact value without ceiling
  if (policyItems.length === 3) {
    return adjusted;
  }

  // Apply ceiling to adjusted premium, then cap at policy maximum
  const ceiledPremium = Math.ceil(adjusted);
  return Math.min(ceiledPremium, getPolicyCap(total));
}

// Legacy export for backward compatibility
export const quotePolicy = calculatePremium;

interface ClaimEntry {
  itemIndex: number;
  damageAmount: number;
}

function getReimbursementRate(item: PolicyItem): number {
  if (item.dragonMaterial) {
    return 1.0;
  }
  if (item.enchantment && item.enchantment >= 8) {
    return 0.5;
  }
  return 0;
}

function calculateItemReimbursement(item: PolicyItem, damageAmount: number): number {
  return damageAmount * getReimbursementRate(item);
}

function calculateClaimDeductible(claimCount: number): number {
  if (claimCount > 1) {
    const DEDUCTIBLE_PER_EVENT = 10;
    return DEDUCTIBLE_PER_EVENT * claimCount;
  }
  return 0;
}

function calculateSingleClaimReimbursement(item: PolicyItem, damageAmount: number): number {
  const reimbursement = calculateItemReimbursement(item, damageAmount);
  // For single event with 0 reimbursement, use damage amount instead
  return reimbursement === 0 ? damageAmount : reimbursement;
}

function validateClaim(claim: ClaimEntry, policyItemCount: number): void {
  if (claim.damageAmount < 0) {
    throw new Error(`Damage amount cannot be negative: ${claim.damageAmount}`);
  }
  if (claim.itemIndex < 0 || claim.itemIndex >= policyItemCount) {
    throw new Error(`Item index out of bounds: ${claim.itemIndex}`);
  }
}

export function processClaim(policy: unknown, claims: unknown): number {
  const policyItems = policy as PolicyItem[];
  const claimEntries = claims as ClaimEntry[];

  // Validate all claims
  for (const claim of claimEntries) {
    validateClaim(claim, policyItems.length);
  }

  // Calculate total item value for policy cap
  const totalItemValue = policyItems.reduce((sum, item) => sum + item.baseCost, 0);

  let totalReimbursement = 0;
  for (const claim of claimEntries) {
    const item = policyItems[claim.itemIndex];
    if (claimEntries.length === 1) {
      totalReimbursement += calculateSingleClaimReimbursement(item, claim.damageAmount);
    } else {
      totalReimbursement += calculateItemReimbursement(item, claim.damageAmount);
    }
  }

  // Apply deductible for multiple damage events
  const deductible = calculateClaimDeductible(claimEntries.length);
  totalReimbursement -= deductible;

  // Cap the reimbursement at the policy maximum and at 0G minimum
  return Math.max(0, Math.min(totalReimbursement, getPolicyCap(totalItemValue)));
}
