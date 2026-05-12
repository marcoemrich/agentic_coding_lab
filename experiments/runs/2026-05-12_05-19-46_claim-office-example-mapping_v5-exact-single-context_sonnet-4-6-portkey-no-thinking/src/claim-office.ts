export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
  contractCount: number;
};

export type QuoteInput = {
  items: Item[];
  customer: Customer;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const quote = ({ items, customer }: QuoteInput): number => {
  const countByType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});
  const policyBase = Object.entries(countByType).reduce((sum, [type, count]) => {
    return sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type]);
  }, 0);
  const itemSurcharges = items.reduce((sum, item) => {
    const base = BASE_PREMIUMS[item.type];
    const cursedSurcharge = item.cursed ? CURSED_SURCHARGE_RATE * base : 0;
    const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
    const highEnchantmentSurcharge = isHighlyEnchanted ? HIGH_ENCHANTMENT_SURCHARGE_RATE * base : 0;
    return sum + cursedSurcharge + highEnchantmentSurcharge;
  }, 0);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE * policyBase : 0;
  const followUpDiscount = customer.contractCount >= 1 ? FOLLOW_UP_DISCOUNT_RATE * policyBase : 0;
  const firstInsurance = FIRST_INSURANCE_RATE * policyBase;
  return Math.ceil(policyBase + itemSurcharges - loyaltyDiscount - followUpDiscount + firstInsurance) + PROCESSING_FEE;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Policy = {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export type ClaimInput = {
  policy: Policy;
  incident: Incident;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

export const claim = ({ policy, incident }: ClaimInput): ClaimResult => {
  const rawPayout = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find(policyItem => policyItem.type === damage.itemType);
    const isHighlyEnchanted = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    const reimbursableAmount = isHighlyEnchanted
      ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
      : damage.amount;
    return sum + Math.floor(Math.max(0, reimbursableAmount - DEDUCTIBLE));
  }, 0);
  const payout = Math.min(rawPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
