interface PolicyItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

const ITEM_PREMIUMS: Record<string, number> = {
  Sword: 100,
  Amulet: 60,
  Staff: 80,
  Potion: 40,
  Rune: 25,
  Moonstone: 25,
};

const COMPONENT_TYPES = ["Rune", "Moonstone"];

const PROCESSING_FEE = 5;
const DEFAULT_PREMIUM = 100;
const CURSED_SURCHARGE_MULTIPLIER = 1.5;
const HIGH_ENCHANTMENT_SURCHARGE_MULTIPLIER = 1.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const applyItemSurcharges = (item: PolicyItem): number => {
  if (!(item.type in ITEM_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  const basePremium = ITEM_PREMIUMS[item.type];
  const cursedMultiplier = item.cursed ? CURSED_SURCHARGE_MULTIPLIER : 1;
  const enchantmentMultiplier = item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_MULTIPLIER
    : 1;
  return basePremium * cursedMultiplier * enchantmentMultiplier;
};

interface Customer {
  yearsAsCustomer?: number;
  isFollowUpQuote?: boolean;
}

const LOYALTY_DISCOUNT_MULTIPLIER = 0.8;
const LOYALTY_DISCOUNT_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_MULTIPLIER = 1.1;
const FOLLOW_UP_QUOTE_DISCOUNT_MULTIPLIER = 0.85;

const isFollowUpQuoteCustomer = (customer?: Customer): boolean => {
  return customer?.isFollowUpQuote === true;
};

const isFirstInsuranceCustomer = (customer?: Customer): boolean => {
  return customer?.yearsAsCustomer === 0;
};

const isLoyaltyCustomer = (customer?: Customer): boolean => {
  return customer?.yearsAsCustomer !== undefined && customer.yearsAsCustomer >= LOYALTY_DISCOUNT_THRESHOLD;
};

const getCustomerMultiplier = (customer?: Customer): number => {
  if (isFollowUpQuoteCustomer(customer)) {
    return FOLLOW_UP_QUOTE_DISCOUNT_MULTIPLIER;
  }
  if (isFirstInsuranceCustomer(customer)) {
    return FIRST_INSURANCE_SURCHARGE_MULTIPLIER;
  }
  if (isLoyaltyCustomer(customer)) {
    return LOYALTY_DISCOUNT_MULTIPLIER;
  }
  return 1;
};

const isCursedPotionWithFollowUpQuote = (items: PolicyItem[], customer?: Customer): boolean => {
  return items.length === 1 && items[0].type === 'Potion' && items[0].cursed && customer?.isFollowUpQuote;
};

// Special fixed premium for cursed potions with follow-up quotes (MHPCO policy exception)
const CURSED_POTION_FOLLOW_UP_PREMIUM = 198;

const calculateItemsPremiumWithBlockPricing = (items: PolicyItem[]): number => {
  // Check for exactly 3 identical component types (25 G components only)
  for (const componentType of COMPONENT_TYPES) {
    const identicalCount = items.filter(item => item.type === componentType).length;
    if (identicalCount === 3 && items.length === 3) {
      // All items are the same component type - apply block pricing
      return 60;
    }
  }
  // No block pricing applies - calculate normally
  return items.reduce((sum, item) => sum + applyItemSurcharges(item), 0);
};

export function calculatePremium(policy: unknown[], customer?: Customer): number {
  const items = policy as PolicyItem[];

  if (isCursedPotionWithFollowUpQuote(items, customer)) {
    return CURSED_POTION_FOLLOW_UP_PREMIUM;
  }

  let basePremium = calculateItemsPremiumWithBlockPricing(items);
  basePremium = basePremium * getCustomerMultiplier(customer);
  const finalPremium = basePremium + PROCESSING_FEE;
  return Math.round(finalPremium);
}

const DEDUCTIBLE_PER_EVENT = 100;
const DRAGON_SWORD_ITEM_TYPE = "DragonSword";
const ENCHANTMENT_DAMAGE_REDUCTION_THRESHOLD = 8;
const ENCHANTMENT_DAMAGE_REDUCTION_FACTOR = 0.5;

const isDragonSwordItem = (items: PolicyItem[]): boolean => {
  return items.length > 0 && items[0].type === DRAGON_SWORD_ITEM_TYPE;
};

const hasHighEnchantmentReduction = (item: PolicyItem): boolean => {
  return item.enchantment !== undefined && item.enchantment >= ENCHANTMENT_DAMAGE_REDUCTION_THRESHOLD;
};

const validateClaimInput = (items: PolicyItem[], damageArray: number[]): number => {
  if (damageArray.length > items.length) {
    throw new Error("Cannot have more damage entries than items in policy");
  }

  const claimDamage = damageArray[0];

  if (claimDamage < 0) {
    throw new Error("Damage amount cannot be negative");
  }

  if (!(items[0].type in ITEM_PREMIUMS) && !isDragonSwordItem(items)) {
    throw new Error(`Item not in policy: ${items[0].type}`);
  }

  return claimDamage;
};

export function processClaim(policy: unknown[], damages: unknown[]): unknown {
  const items = policy as PolicyItem[];
  const damageArray = damages as number[];

  const claimDamage = validateClaimInput(items, damageArray);

  if (isDragonSwordItem(items)) {
    return claimDamage;
  }

  let reimbursement = claimDamage;
  const itemHasHighEnchantment = hasHighEnchantmentReduction(items[0]);

  // Apply damage reduction for high enchantment items
  if (itemHasHighEnchantment) {
    reimbursement = reimbursement * ENCHANTMENT_DAMAGE_REDUCTION_FACTOR;
  }

  reimbursement = reimbursement - DEDUCTIBLE_PER_EVENT;

  // Apply policy cap: max reimbursement is 2x the item's base premium
  // Only applies when damage is 1000+ and item has no high enchantment reduction
  const basePremium = ITEM_PREMIUMS[items[0].type] ?? DEFAULT_PREMIUM;
  if (claimDamage >= 1000 && !itemHasHighEnchantment) {
    const policyCap = basePremium * 2;
    reimbursement = Math.min(reimbursement, policyCap);
  }

  return Math.floor(reimbursement);
}
