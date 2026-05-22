interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Policy {
  items: Item[];
  customer: { yearsWithMHPCO: number };
  isFollowUp: boolean;
}

interface Incident {
  damages: { type: string; amount: number }[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const BASE_PREMIUM: Record<string, number> = { sword: 100, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const DEFAULT_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE = 0.5;

function basePremiumForType(type: string): number {
  return BASE_PREMIUM[type] ?? DEFAULT_BASE_PREMIUM;
}

function itemSurcharges(item: Item): number {
  const base = basePremiumForType(item.type);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE_RATE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function itemGroupPremium(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * basePremiumForType(type);
}

export function quote(policy: Policy) {
  const counts = countByType(policy.items);

  let basePremium = 0;
  for (const [type, count] of Object.entries(counts)) {
    basePremium += itemGroupPremium(type, count);
  }

  let totalItemSurcharges = 0;
  for (const item of policy.items) {
    totalItemSurcharges += itemSurcharges(item);
  }

  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const isLoyalCustomer = policy.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD;
  const loyaltyDiscount = isLoyalCustomer ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = policy.isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const totalPolicyDiscounts = loyaltyDiscount + followUpDiscount;
  const premium = Math.ceil(basePremium + totalItemSurcharges + firstInsuranceSurcharge - totalPolicyDiscounts + PROCESSING_FEE);
  return { premium };
}

const INSURANCE_VALUE: Record<string, number> = { sword: 1000, rune: 250, amulet: 600 };
const DEDUCTIBLE = 100;

export function claim(policy: Policy, incident: Incident) {
  let insuranceSum = 0;
  for (const item of policy.items) {
    insuranceSum += INSURANCE_VALUE[item.type] ?? 0;
  }
  const totalCap = 2 * insuranceSum;

  let payout = 0;
  for (const damage of incident.damages) {
    const policyItem = policy.items.find(item => item.type === damage.type);
    const enchantment = policyItem?.enchantment ?? 0;
    const grossReimbursement = enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE
      : damage.amount;
    payout += grossReimbursement - DEDUCTIBLE;
  }

  const remainingCap = totalCap - payout;
  return { payout, remainingCap };
}
