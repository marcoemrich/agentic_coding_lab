const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  potion: 40,
  amulet: 60,
  staff: 80,
  rune: 25,
};

type Item = { type: string; material: string; enchantment: number; cursed: boolean };

const itemBasePremium = (item: Item): number => BASE_PREMIUM[item.type] ?? 0;

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponentBlock = (group: Item[]): boolean =>
  group.length === COMPONENT_BLOCK_SIZE && itemBasePremium(group[0]) === COMPONENT_PREMIUM;

const groupPremium = (group: Item[]): number =>
  isComponentBlock(group) ? COMPONENT_BLOCK_PREMIUM : group.reduce((sum, item) => sum + itemBasePremium(item), 0);

const groupItemsByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
};

const totalBasePremium = (items: Item[]): number =>
  Array.from(groupItemsByType(items).values()).reduce(
    (total, group) => total + groupPremium(group),
    0
  );

const sumSurcharge = (items: Item[], appliesTo: (item: Item) => boolean, rate: number): number =>
  items.filter(appliesTo).reduce((sum, item) => sum + itemBasePremium(item) * rate, 0);

const conditionalDiscount = (applies: boolean, amount: number, rate: number): number =>
  applies ? amount * rate : 0;

export function quote(customer: { yearsWithMHPCO: number }, items: Item[], contractIndex: number): number {
  const basePremium = totalBasePremium(items);
  const cursedSurcharge = sumSurcharge(items, (item) => item.cursed, CURSED_SURCHARGE_RATE);
  const enchantmentSurcharge = sumSurcharge(items, (item) => item.enchantment >= 5, HIGH_ENCHANTMENT_SURCHARGE_RATE);
  const itemTotal = basePremium + cursedSurcharge + enchantmentSurcharge;

  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = conditionalDiscount(contractIndex > 0, basePremium, FOLLOW_UP_DISCOUNT_RATE);
  const loyaltyDiscount = conditionalDiscount(customer.yearsWithMHPCO >= 2, basePremium, LOYALTY_DISCOUNT_RATE);
  const policyAdjustment = firstInsuranceSurcharge - followUpDiscount - loyaltyDiscount;

  return Math.ceil(itemTotal + policyAdjustment + PROCESSING_FEE);
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const itemInsuranceValue = (item: Item): number => INSURANCE_VALUE[item.type] ?? 0;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isHighEnchantmentClaim = (policyItem: Item | undefined): boolean =>
  policyItem !== undefined && policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: { amount: number }, policyItem: Item | undefined): number =>
  isHighEnchantmentClaim(policyItem)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const claimableAmount = (damage: { itemType: string; amount: number }, policyItems: Item[]): number => {
  const policyItem = policyItems.find((item) => item.type === damage.itemType);
  return Math.max(0, reimbursableAmount(damage, policyItem) - DEDUCTIBLE);
};

export function claim(policyItems: Item[], damages: Array<{ itemType: string; amount: number }>, currentCap?: number) {
  const insuranceSum = policyItems.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  const payoutCap = currentCap ?? 2 * insuranceSum;
  const uncappedPayout = damages.reduce((sum, damage) => sum + claimableAmount(damage, policyItems), 0);
  const payout = Math.floor(Math.min(uncappedPayout, payoutCap));
  return { payout, remainingCap: payoutCap - payout };
}
