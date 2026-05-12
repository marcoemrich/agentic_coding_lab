export type Customer = {
  yearsWithMHPCO: number;
  contractCount: number;
};

export type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  rune: 25,
};

const PROCESSING_FEE = 5;
const BUNDLE_SIZE = 3;
const BUNDLE_BASE_PREMIUM = 60;
const CURSED_RISK_SURCHARGE = 3; // ×3/2 = +50%, integer-safe
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE = 13; // ×13/10 = +30%, integer-safe
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_DIVISOR = 5; // ÷5 = −20%
const REPEAT_CONTRACT_DISCOUNT_NUM = 3; // ×3/20 = −15%, integer-safe
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR = 2; // 50% reimbursement

export const quote = (customer: Customer, items: Item[]): number => {
  const isBundle = items.length === BUNDLE_SIZE && items.every(i => i.type === items[0].type);
  const rawPremium = isBundle ? BUNDLE_BASE_PREMIUM : BASE_PREMIUM[items[0].type];
  const afterCurseSurcharge = items[0].cursed ? rawPremium * CURSED_RISK_SURCHARGE / 2 : rawPremium;
  const basePremium = items[0].enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? afterCurseSurcharge * ENCHANTMENT_SURCHARGE / 10 : afterCurseSurcharge;
  const premiumWithContractModifier = customer.contractCount === 0
    ? basePremium + basePremium / 10
    : basePremium - basePremium * REPEAT_CONTRACT_DISCOUNT_NUM / 20;
  const premiumWithDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? premiumWithContractModifier - premiumWithContractModifier / LOYALTY_DISCOUNT_DIVISOR : premiumWithContractModifier;
  return Math.ceil(premiumWithDiscount) + PROCESSING_FEE;
};

export type Policy = {
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export type Damage = {
  itemType: string;
  amount: number;
  enchantment?: number;
  material?: string;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

const effectiveDamage = (d: Damage): number =>
  d.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? d.amount / HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR : d.amount;

export const claim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  const totalDamage = incident.damages.reduce((sum, d) => sum + effectiveDamage(d), 0);
  const payout = Math.min(totalDamage - DEDUCTIBLE, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
