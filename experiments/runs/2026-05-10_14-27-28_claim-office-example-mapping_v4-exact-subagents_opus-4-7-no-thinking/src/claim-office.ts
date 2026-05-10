export type Customer = {
  yearsWithMHPCO: number;
  previousContracts: number;
};

export type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
};

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function itemSurcharge(item: Item): number {
  const itemBase = BASE_PREMIUMS[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += itemBase * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function typeSubtotal(type: string, count: number): number {
  const isBlock = COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;
  return isBlock ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
}

function loyaltyDiscount(customer: Customer, policyBase: number): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
}

function followupDiscount(customer: Customer, policyBase: number): number {
  return customer.previousContracts >= 1
    ? policyBase * FOLLOWUP_DISCOUNT_RATE
    : 0;
}

export type Damage = {
  itemType: string;
  amount: number;
};

function reimbursementAmount(item: Item | undefined, damageAmount: number): number {
  const isHighEnchantment =
    !!item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  return isHighEnchantment
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE * damageAmount
    : damageAmount;
}

function countByKey<T>(values: T[], key: (value: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const k = key(value);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export function claim(
  items: Item[],
  damages: Damage[],
  previousPaid: number = 0,
): { payout: number; remainingCap: number } {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) {
    throw new Error(`negative damage amount: ${negative.amount}`);
  }
  const itemCounts = countByKey(items, (i) => i.type);
  const damageCounts = countByKey(damages, (d) => d.itemType);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) {
      throw new Error(`damage count exceeds insured count for type ${type}`);
    }
  }
  const totalPayout = damages.reduce((sum, damage) => {
    const item = items.find((i) => i.type === damage.itemType);
    const reimbursed = reimbursementAmount(item, damage.amount);
    return sum + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  const cap = CAP_MULTIPLIER * insuranceSum;
  const capRemainingBeforeClaim = cap - previousPaid;
  const cappedPayout = Math.min(Math.floor(totalPayout), capRemainingBeforeClaim);
  return { payout: cappedPayout, remainingCap: capRemainingBeforeClaim - cappedPayout };
}

export function quote(customer: Customer, items: Item[]): number {
  for (const item of items) {
    if (BASE_PREMIUMS[item.type] === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const countsByType = countByKey(items, (i) => i.type);

  const policyBase = Object.entries(countsByType)
    .reduce((sum, [type, count]) => sum + typeSubtotal(type, count), 0);

  const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const loyalty = loyaltyDiscount(customer, policyBase);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const followup = followupDiscount(customer, policyBase);

  return Math.ceil(policyBase + itemSurcharges - loyalty + firstInsurance - followup) + PROCESSING_FEE;
}
