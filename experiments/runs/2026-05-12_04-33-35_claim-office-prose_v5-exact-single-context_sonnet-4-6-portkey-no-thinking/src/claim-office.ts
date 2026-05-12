type Customer = { yearsWithMHPCO: number };
type Item = { type: string; material: string; enchantment: number; cursed: boolean };
type QuoteOptions = { contractNumber: number };
type Damage = { itemType: string; amount: number; enchantment: number; material: string };
type Incident = { damages: Damage[] };
type Policy = { insuranceSum: number; remainingCap: number };
type ClaimResult = { payout: number; remainingCap: number };

const HIGH_ENCHANTMENT_LEVEL = 5;
const CLAIM_HIGH_ENCHANTMENT_LEVEL = 8;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_CONTRACT_NUMBER = 1;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
};
const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

const basePremium = (items: Item[]): number => {
  const isBuildingBlock = items.length === 3 && items.every(item => item.type === items[0].type);
  if (isBuildingBlock) return BUILDING_BLOCK_PREMIUM;
  return items.reduce((sum, item) => sum + (BASE_PREMIUMS[item.type] ?? COMPONENT_BASE_PREMIUM), 0);
};

export const quote = (customer: Customer, items: Item[], options: QuoteOptions): number => {
  let premium = basePremium(items);
  if (items.some(item => item.cursed)) premium *= 1.5;
  if (items.some(item => item.enchantment >= HIGH_ENCHANTMENT_LEVEL)) premium *= 1.3;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) premium *= 0.8;
  if (options.contractNumber === FIRST_CONTRACT_NUMBER) premium *= 1.1;
  else premium *= 0.85;
  return Math.ceil(Math.round(premium * 100) / 100) + PROCESSING_FEE;
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  const totalDamage = incident.damages.reduce((sum, d) => sum + d.amount, 0);
  const hasDragonDamage = incident.damages.some(d => d.material === "dragon");
  const hasHighEnchantment = incident.damages.some(d => d.enchantment >= CLAIM_HIGH_ENCHANTMENT_LEVEL);
  const reimbursable = hasHighEnchantment ? totalDamage * 0.5 : totalDamage;
  const payout = hasDragonDamage
    ? totalDamage
    : Math.max(0, reimbursable - DEDUCTIBLE);
  return { payout, remainingCap: policy.remainingCap - payout };
};
