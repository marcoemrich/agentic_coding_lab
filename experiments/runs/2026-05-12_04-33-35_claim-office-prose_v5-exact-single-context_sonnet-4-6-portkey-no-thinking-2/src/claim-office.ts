export type Customer = {
  yearsWithMHPCO: number;
  priorContracts: number;
};

export type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
  moonstone: 250,
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.20;
const LOYALTY_YEARS_THRESHOLD = 2;
const SUBSEQUENT_DISCOUNT = 0.15;
const BUNDLE_SIZE = 3;
const BUNDLE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.50;
const DRAGON_MATERIAL = "dragon";

const roundUp = (n: number): number => Math.ceil(Math.round(n * 100) / 100);

const itemBasePremium = (item: Item): number => {
  const cursedMultiplier = item.cursed ? 1 + CURSED_SURCHARGE : 1;
  const enchantmentMultiplier = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? 1 + HIGH_ENCHANTMENT_SURCHARGE : 1;
  return BASE_PREMIUMS[item.type] * cursedMultiplier * enchantmentMultiplier;
};

export const quote = (customer: Customer, items: Item[]): number => {
  const loyaltyMultiplier = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? 1 - LOYALTY_DISCOUNT : 1;
  const contractMultiplier = customer.priorContracts === 0 ? 1 + FIRST_INSURANCE_SURCHARGE : 1 - SUBSEQUENT_DISCOUNT;
  const isBundle = items.length === BUNDLE_SIZE && items.every(i => i.type === items[0].type);
  const itemsPremiumTotal = isBundle ? BUNDLE_PREMIUM : items.reduce((sum, item) => sum + itemBasePremium(item), 0);
  return roundUp(itemsPremiumTotal * loyaltyMultiplier * contractMultiplier) + PROCESSING_FEE;
};

type Policy = { insuranceSum: number; remainingCap: number };
type Damage = { amount: number; enchantment: number; material: string };
type Incident = { damages: Damage[] };
type ClaimResult = { payout: number; remainingCap: number };

const effectiveDamage = (d: Damage): number => {
  if (d.material === DRAGON_MATERIAL) return d.amount;
  if (d.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return d.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return d.amount;
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  const totalDamage = incident.damages.reduce((sum, d) => sum + effectiveDamage(d), 0);
  const payout = Math.min(totalDamage - DEDUCTIBLE, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
