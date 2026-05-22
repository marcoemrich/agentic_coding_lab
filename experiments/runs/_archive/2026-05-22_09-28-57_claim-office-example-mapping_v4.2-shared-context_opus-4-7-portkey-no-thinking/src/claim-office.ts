export interface Customer {
  yearsWithMHPCO: number;
  previousContracts?: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENTS_PER_BLOCK = 3;
const COMPONENT_BLOCK_BASE = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACTS_THRESHOLD = 1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export interface Policy {
  items: Item[];
  remainingCap?: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursableAmount(item: Item | undefined, damageAmount: number): number {
  const isHighEnchantment = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  return isHighEnchantment ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damageAmount;
}

const afterDeductible = (amount: number): number => Math.max(0, amount - DEDUCTIBLE);

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const insuranceSum = policy.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  const availableCap = policy.remainingCap ?? CAP_MULTIPLIER * insuranceSum;
  const rawPayout = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((policyItem) => policyItem.type === damage.itemType);
    return sum + afterDeductible(reimbursableAmount(item, damage.amount));
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, availableCap));
  return { payout, remainingCap: availableCap - payout };
}

export function quote(customer: Customer, items: Item[]): number {
  const percentageSurcharge = (rate: number, applies: (item: Item) => boolean): number =>
    items.filter(applies).reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rate, 0);

  const baseSum = items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  // A block of exactly COMPONENTS_PER_BLOCK alike components (same type) replaces their summed base with COMPONENT_BLOCK_BASE.
  const blockAdjustment = COMPONENT_TYPES.reduce((adjustment, componentType) => {
    const count = items.filter((item) => item.type === componentType).length;
    const replacement = COMPONENT_BLOCK_BASE - COMPONENTS_PER_BLOCK * BASE_PREMIUMS[componentType];
    return count === COMPONENTS_PER_BLOCK ? adjustment + replacement : adjustment;
  }, 0);
  const curseSurcharge = percentageSurcharge(CURSE_SURCHARGE_RATE, (item) => item.cursed === true);
  const highEnchantmentSurcharge = percentageSurcharge(
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  );
  const adjustedBase = baseSum + blockAdjustment;
  const proportionalDiscount = (rate: number, qualifies: boolean): number => (qualifies ? adjustedBase * rate : 0);
  const firstInsurance = adjustedBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = proportionalDiscount(LOYALTY_DISCOUNT_RATE, customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD);
  const followUpDiscount = proportionalDiscount(FOLLOW_UP_DISCOUNT_RATE, (customer.previousContracts ?? 0) >= FOLLOW_UP_CONTRACTS_THRESHOLD);
  return Math.ceil(adjustedBase + curseSurcharge + highEnchantmentSurcharge + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}
