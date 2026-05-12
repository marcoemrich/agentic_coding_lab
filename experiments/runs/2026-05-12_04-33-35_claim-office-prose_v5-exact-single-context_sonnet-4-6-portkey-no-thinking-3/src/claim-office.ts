interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

const PROCESSING_FEE = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BUNDLE_SIZE = 3;
const BUNDLE_PREMIUM = 60;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

export const quote = (customer: Customer, items: Item[], contractNumber: number): number => {
  const item = items[0];
  const isBundle = items.length === BUNDLE_SIZE && items.every(i => i.type === item.type);
  const totalBase = isBundle ? BUNDLE_PREMIUM : items.reduce((sum, i) => sum + (BASE_PREMIUM[i.type] ?? 0), 0);

  let multiplier = 1;
  if (contractNumber === 1) multiplier *= 1.10;
  else multiplier *= 0.85;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) multiplier *= 0.80;
  if (item.cursed) multiplier *= 1.50;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) multiplier *= 1.30;

  return Math.ceil(Math.round(totalBase * multiplier * 100) / 100) + PROCESSING_FEE;
};

interface Policy {
  insuranceSum: number;
  remainingCap: number;
}

interface Damage {
  itemType: string;
  enchantment: number;
  material: string;
  amount: number;
}

interface Incident {
  damages: Damage[];
}

const DEDUCTIBLE = 100;
const PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

export const claim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  const damage = incident.damages[0];
  const isPartialReimbursement = damage.material !== "dragon" && damage.enchantment >= PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
  const damageAmount = isPartialReimbursement ? damage.amount * 0.50 : damage.amount;
  const payout = Math.min(damageAmount - DEDUCTIBLE, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
