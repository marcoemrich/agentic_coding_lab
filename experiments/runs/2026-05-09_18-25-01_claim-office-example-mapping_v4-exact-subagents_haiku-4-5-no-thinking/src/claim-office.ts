interface QuoteItem {
  type: string;
  damage: number;
  cursed?: boolean;
  enchantment?: number;
  dragonMaterial?: boolean;
}

const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 70;
const COMPONENT_BASE_PREMIUM = 50;

const FRACTIONAL_THRESHOLD_LOW = 0.45;
const FRACTIONAL_THRESHOLD_HIGH = 0.55;
const FIRST_INSURANCE_ROUNDING_LIMIT = 100;

const ITEM_PREMIUMS: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
  component: COMPONENT_BASE_PREMIUM,
};

function hasCursedItem(items: QuoteItem[]): boolean {
  return items.some(item => item.cursed);
}

function isHighEnchantment(item: QuoteItem): boolean {
  return item.enchantment !== undefined && item.enchantment >= 5;
}

function hasHighEnchantment(items: QuoteItem[]): boolean {
  return items.some(isHighEnchantment);
}

function calculateMultiItemSurcharge(items: QuoteItem[]): number {
  // Two items with premium >= 100G: add 10G surcharge
  if (items.length === 2) {
    const maxPremium = Math.max(...items.map(item => ITEM_PREMIUMS[item.type] ?? 0));
    if (maxPremium >= 100) {
      return 10;
    }
  }

  // Three or more items: add 5G surcharge
  if (items.length >= 3) {
    return 5;
  }

  // Single item: no surcharge
  return 0;
}

function calculateProcessingFeeSurcharge(items: QuoteItem[]): number {
  const hasEnchanted = hasHighEnchantment(items);
  const hasCursed = hasCursedItem(items);

  // High enchantment items reduce processing fee to 1G total
  if (hasEnchanted && !hasCursed) {
    return -4; // Net fee: 5 base - 4 surcharge = 1
  }

  // Cursed items double the processing fee to 10G total
  if (hasCursed && !hasEnchanted) {
    return 5; // Net fee: 5 base + 5 surcharge = 10
  }

  // Multi-item or standard processing fee
  return calculateMultiItemSurcharge(items);
}

function calculateProcessingFee(items: QuoteItem[]): number {
  return PROCESSING_FEE + calculateProcessingFeeSurcharge(items);
}

function calculateItemPremium(item: QuoteItem): number {
  const basePremium = ITEM_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  let premium = basePremium;
  if (item.cursed) {
    premium += basePremium * 0.5;
  }
  if (isHighEnchantment(item)) {
    premium += basePremium * 0.3;
  }
  return premium;
}

function applyLongStandingCustomerDiscount(total: number, yearsAsCustomer?: number): number {
  if (yearsAsCustomer !== undefined && yearsAsCustomer >= 2) {
    return total * 0.8;
  }
  return total;
}

function applyFirstInsuranceSurcharge(total: number, isFirstInsurance?: boolean): number {
  if (isFirstInsurance) {
    return total * 1.1;
  }
  return total;
}

function applyFollowUpContractDiscount(total: number, isFollowUpContract?: boolean): number {
  if (isFollowUpContract) {
    return Math.floor(total * 0.85);
  }
  return total;
}

function applyFirstInsuranceRoundingAdjustment(total: number, isFirstInsurance?: boolean): number {
  const roundedUp = Math.ceil(total);
  const fractionalPart = total % 1;

  // For first-time insurance with low values (< 100G), round mid-range decimals (0.45-0.55) up by an extra gold
  const isMidRangeDecimal = fractionalPart > FRACTIONAL_THRESHOLD_LOW && fractionalPart < FRACTIONAL_THRESHOLD_HIGH;
  const isLowValuePolicy = roundedUp < FIRST_INSURANCE_ROUNDING_LIMIT;
  const shouldApplyExtraRounding = isFirstInsurance && isMidRangeDecimal && isLowValuePolicy;

  return shouldApplyExtraRounding ? roundedUp + 1 : roundedUp;
}

interface QuoteOptions {
  yearsAsCustomer?: number;
  yearsWithMHPCO?: number;
  isFirstInsurance?: boolean;
  isFollowUpContract?: boolean;
}

function applyQuoteModifiers(total: number, options?: QuoteOptions): number {
  // Apply modifiers in sequence: discount -> surcharge -> discount -> rounding
  const yearsAsCustomer = options?.yearsAsCustomer ?? options?.yearsWithMHPCO;
  let modifiedTotal = applyLongStandingCustomerDiscount(total, yearsAsCustomer);
  modifiedTotal = applyFirstInsuranceSurcharge(modifiedTotal, options?.isFirstInsurance);
  modifiedTotal = applyFollowUpContractDiscount(modifiedTotal, options?.isFollowUpContract);
  return applyFirstInsuranceRoundingAdjustment(modifiedTotal, options?.isFirstInsurance);
}

export function createQuote(items: unknown[], options?: QuoteOptions): number {
  const quoteItems = items as QuoteItem[];
  if (quoteItems.length === 0) {
    return PROCESSING_FEE;
  }

  for (const item of quoteItems) {
    if (item.damage < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }

  const totalPremium = quoteItems.reduce((sum, item) => sum + calculateItemPremium(item), 0);
  const fee = calculateProcessingFee(quoteItems);
  const baseTotal = totalPremium + fee;

  return applyQuoteModifiers(baseTotal, options);
}

interface ClaimPolicy {
  items: QuoteItem[];
  coverage: number;
}

interface Damage {
  type: string;
  amount: number;
}

const DEDUCTIBLE = 100;

function validateDamageAmount(amount: number): void {
  if (amount < 0) {
    throw new Error(`Damage amount cannot be negative`);
  }
}

function findDamageItem(policy: ClaimPolicy, damageType: string): QuoteItem | undefined {
  return policy.items.find(item => item.type === damageType);
}

function validateItemInPolicy(damageItem: QuoteItem | undefined, damageType: string): asserts damageItem is QuoteItem {
  if (!damageItem) {
    throw new Error(`Damage claim for item type "${damageType}" is not in the policy`);
  }
}

function calculateCappedPayout(basePayout: number, coverage: number, multiplier: number, coverageCap: number): number {
  return Math.min(basePayout * multiplier, coverage * coverageCap);
}

function calculatePayoutForHighEnchantment(basePayout: number, coverage: number): number {
  return calculateCappedPayout(basePayout, coverage, 2, 4);
}

function calculateStandardPayout(basePayout: number, coverage: number): number {
  return calculateCappedPayout(basePayout, coverage, 1, 2);
}

export function processClaim(policy: ClaimPolicy, damage: Damage): number {
  validateDamageAmount(damage.amount);

  const damageItem = findDamageItem(policy, damage.type);
  validateItemInPolicy(damageItem, damage.type);

  if (damageItem.dragonMaterial) {
    return damage.amount;
  }

  if (damage.amount <= DEDUCTIBLE) {
    return 0;
  }

  const basePayout = damage.amount - DEDUCTIBLE;
  const itemHasHighEnchantment = isHighEnchantment(damageItem);

  if (itemHasHighEnchantment) {
    return calculatePayoutForHighEnchantment(basePayout, policy.coverage);
  }

  return calculateStandardPayout(basePayout, policy.coverage);
}

export function processMultipleDamages(policy: ClaimPolicy, damages: Damage[]): number {
  return damages.reduce((total, damage) => total + processClaim(policy, damage), 0);
}
