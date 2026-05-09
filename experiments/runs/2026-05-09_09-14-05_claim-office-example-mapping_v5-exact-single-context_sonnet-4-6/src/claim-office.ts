export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Policy = {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PRICE = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: COMPONENT_BASE_PREMIUM,
};

export const quote = (
  customer: Customer,
  items: Item[],
  contractNumber: number
): number => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let basePremium = 0;
  for (const [type, count] of Object.entries(counts)) {
    basePremium += count === 3 && BASE_PREMIUMS[type] === COMPONENT_BASE_PREMIUM
      ? COMPONENT_BLOCK_PRICE
      : count * BASE_PREMIUMS[type];
  }
  let itemSurcharge = 0;
  for (const item of items) {
    if (item.cursed) itemSurcharge += BASE_PREMIUMS[item.type] * CURSED_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) itemSurcharge += BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = contractNumber > 1 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const rawPremium = basePremium + itemSurcharge - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE;
  return Math.ceil(rawPremium);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

export const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = 1000;
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
};

export const processClaim = (
  policy: Policy,
  incident: Incident
): { payout: number; remainingCap: number } => {
  const damage = incident.damages[0];
  const item = policy.items.find(i => i.type === damage.itemType);
  const isHighlyEnchanted = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const amount = isHighlyEnchanted ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damage.amount;
  const payout = Math.min(amount - DEDUCTIBLE, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
