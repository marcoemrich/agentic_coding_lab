interface CustomerContext {
  yearsWithMHPCO: number;
  previousQuotes: number;
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  type: string;
  amount: number;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function basePremiumForType(type: string): number {
  return BASE_PREMIUM[type] ?? 0;
}

function cursedSurchargeFor(item: Item): number {
  return item.cursed ? basePremiumForType(item.type) * 0.5 : 0;
}

function highEnchantmentSurchargeFor(item: Item): number {
  return (item.enchantment ?? 0) >= 5 ? basePremiumForType(item.type) * 0.3 : 0;
}

function itemSurchargesFor(item: Item): number {
  return cursedSurchargeFor(item) + highEnchantmentSurchargeFor(item);
}

function loyaltyDiscountFor(basePremium: number, customer: CustomerContext): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function firstInsuranceSurchargeFor(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function followUpDiscountFor(basePremium: number, customer: CustomerContext): number {
  return customer.previousQuotes >= 1
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
}

function premiumForGroup(type: string, count: number): number {
  if (COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * basePremiumForType(type);
}

export function quote(items: Item[], customer: CustomerContext): number {
  const counts = countByType(items);

  const basePremium = Object.entries(counts)
    .reduce((sum, [type, count]) => sum + premiumForGroup(type, count), 0);

  const itemSurcharges = items.reduce((sum, item) =>
    sum + itemSurchargesFor(item), 0);

  const policyAdjustment =
    - loyaltyDiscountFor(basePremium, customer)
    + firstInsuranceSurchargeFor(basePremium)
    - followUpDiscountFor(basePremium, customer);

  return Math.ceil(basePremium + itemSurcharges + policyAdjustment + PROCESSING_FEE);
}

function reimbursementFor(damage: Damage, policyItem: Item | undefined): number {
  return (policyItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
}

export function claim(policy: Item[], damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = damages.reduce((sum, damage) => {
    const policyItem = policy.find(item => item.type === damage.type);
    return sum + (reimbursementFor(damage, policyItem) - DEDUCTIBLE_PER_DAMAGE);
  }, 0);
  const insuranceSum = policy.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
  const cap = insuranceSum * 2;
  const flooredPayout = Math.floor(payout);
  return { payout: flooredPayout, remainingCap: cap - flooredPayout };
}
