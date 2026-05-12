export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
};

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 100;

const withFirstInsuranceSurcharge = (base: number): number => base + base * FIRST_INSURANCE_SURCHARGE;

const itemPremium = (item: Item): number => {
  const base = basePremiumFor(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return withFirstInsuranceSurcharge(base) + cursedSurcharge + enchantmentSurcharge;
};

const premiumBeforeFee = (items: Item[]): number => {
  if (
    items.length === COMPONENT_BLOCK_SIZE &&
    items.every((item) => item.type === items[0].type) &&
    basePremiumFor(items[0]) === COMPONENT_BASE_PREMIUM
  ) {
    return withFirstInsuranceSurcharge(COMPONENT_BLOCK_PREMIUM);
  }
  return items.reduce((sum, item) => sum + itemPremium(item), 0);
};

const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;

const policyBasePremium = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item), 0);

export const quote = (
  customer: Customer,
  items: Item[],
  previousQuotes: number
): number => {
  const policyBase = policyBasePremium(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = previousQuotes >= 1 ? policyBase * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(premiumBeforeFee(items) - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const reimbursementRateFor = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT;
  return 1;
};

const payoutForDamage = (damage: Damage, item: Item, cap: number): number =>
  Math.floor(Math.min(damage.amount * reimbursementRateFor(item) - DEDUCTIBLE, cap));

export const claim = (
  policy: Policy,
  incident: Incident,
  cap: number
): { payout: number; remainingCap: number } => {
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((insuredItem) => insuredItem.type === damage.itemType)!;
    const payout = payoutForDamage(damage, item, cap);
    totalPayout += payout;
    cap -= payout;
  }
  return { payout: totalPayout, remainingCap: cap };
};
