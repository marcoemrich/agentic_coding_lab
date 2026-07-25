export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const BASE_PREMIUM_PER_ITEM = 25;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export interface QuoteOptions {
  isFollowUpContract?: boolean;
}

const totalItemModifiersSurcharge = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + itemModifiersSurcharge(item), 0);

const policyBaseAdjustment = (
  applies: boolean,
  policyBase: number,
  rate: number
): number => (applies ? policyBase * rate : 0);

export const quote = (
  customer: Customer,
  items: QuoteItem[],
  options: QuoteOptions = {}
): QuoteResult => {
  const policyBase = basePremiumForItems(items);
  const subtotal = policyBase + totalItemModifiersSurcharge(items);

  const isLoyalCustomer = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  const loyaltyDiscount = policyBaseAdjustment(
    isLoyalCustomer,
    policyBase,
    LOYALTY_DISCOUNT_RATE
  );
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = policyBaseAdjustment(
    options.isFollowUpContract ?? false,
    policyBase,
    FOLLOW_UP_CONTRACT_DISCOUNT_RATE
  );

  const premium =
    subtotal -
    loyaltyDiscount +
    firstInsuranceSurcharge -
    followUpDiscount +
    PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  insuranceValue: number;
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
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const lookupItemValue = (
  table: Record<string, number>,
  item: QuoteItem
): number => {
  if (item.type in table) {
    return table[item.type];
  }
  throw new Error(`Unknown item type: ${item.type}`);
};

const itemInsuranceValue = (item: QuoteItem): number =>
  lookupItemValue(INSURANCE_VALUE, item);

export const createPolicy = (items: QuoteItem[]): Policy => {
  const policyItems: PolicyItem[] = items.map((item) => ({
    type: item.type,
    material: item.material,
    enchantment: item.enchantment,
    insuranceValue: itemInsuranceValue(item),
  }));
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + item.insuranceValue,
    0
  );
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items: policyItems, insuranceSum, cap, remainingCap: cap };
};

const reimbursementRateFor = (item: PolicyItem): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
};

const payoutForDamage = (damage: DamageEntry, item: PolicyItem): number => {
  const reimbursed = damage.amount * reimbursementRateFor(item);
  return Math.max(reimbursed - DEDUCTIBLE, 0);
};

const takeInsuredItem = (
  availableItems: PolicyItem[],
  itemType: string
): PolicyItem => {
  const index = availableItems.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(`Damaged item not part of policy: ${itemType}`);
  }
  return availableItems.splice(index, 1)[0];
};

const assertNonNegativeDamage = (damage: DamageEntry): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  const availableItems = [...policy.items];
  const rawPayout = incident.damages.reduce((sum, damage) => {
    assertNonNegativeDamage(damage);
    const item = takeInsuredItem(availableItems, damage.itemType);
    return sum + payoutForDamage(damage, item);
  }, 0);
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return {
    payout: Math.floor(payout),
    remainingCap: Math.floor(policy.remainingCap),
  };
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const premiumForGroup = (count: number, unitPrice: number): number =>
  count === BLOCK_SIZE && unitPrice === BASE_PREMIUM_PER_ITEM
    ? BLOCK_PREMIUM
    : count * unitPrice;

export const basePremiumForItems = (items: QuoteItem[]): number => {
  const groups = new Map<string, { count: number; unitPrice: number }>();
  for (const item of items) {
    const existing = groups.get(item.type);
    const unitPrice = itemBasePremium(item);
    groups.set(item.type, {
      count: (existing?.count ?? 0) + 1,
      unitPrice,
    });
  }

  let total = 0;
  for (const { count, unitPrice } of groups.values()) {
    total += premiumForGroup(count, unitPrice);
  }
  return total;
};

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: BASE_PREMIUM_PER_ITEM,
  moonstone: BASE_PREMIUM_PER_ITEM,
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const itemBasePremium = (item: QuoteItem): number =>
  lookupItemValue(ITEM_BASE_PREMIUM, item);

const itemModifiersSurcharge = (item: QuoteItem): number => {
  const base = itemBasePremium(item);
  const isCursed = item.cursed ?? false;
  const hasHighEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  const cursedSurcharge = isCursed ? base * CURSED_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = hasHighEnchantment
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + highEnchantmentSurcharge;
};

export const policyBasePremiumWithModifiers = (
  items: QuoteItem[]
): number => {
  const totalBasePremium = items.reduce(
    (total, item) => total + itemBasePremium(item),
    0
  );
  return totalBasePremium + totalItemModifiersSurcharge(items);
};
