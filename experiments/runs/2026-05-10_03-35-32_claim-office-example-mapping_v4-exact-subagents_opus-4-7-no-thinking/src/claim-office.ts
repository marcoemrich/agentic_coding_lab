const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 10;
const BLOCK_OF_THREE_PREMIUM = 60;
const BLOCK_SIZE = 3;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

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

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
}

function surchargeRate(item: Item): number {
  return (item.cursed ? CURSE_SURCHARGE_RATE : 0)
    + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
}

function itemUnmodifiedBasePremium(item: Item): number {
  return BASE_PREMIUMS[item.type];
}

function itemPerItemSurcharge(item: Item): number {
  return BASE_PREMIUMS[item.type] * surchargeRate(item);
}

function sumUnmodifiedBasePremiums(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemUnmodifiedBasePremium(item), 0);
}

function groupByType(items: Item[]): Record<string, Item[]> {
  const groups: Record<string, Item[]> = {};
  for (const item of items) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  }
  return groups;
}

function policyBaseForGroup(groupItems: Item[]): number {
  return groupItems.length === BLOCK_SIZE
    ? BLOCK_OF_THREE_PREMIUM
    : sumUnmodifiedBasePremiums(groupItems);
}

function calculatePolicyBasePremium(items: Item[]): number {
  const groups = groupByType(items);
  return Object.values(groups).reduce((total, group) => total + policyBaseForGroup(group), 0);
}

function calculatePerItemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemPerItemSurcharge(item), 0);
}

function loyaltyDiscount(basePremium: number, years: number): number {
  return years >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscount(basePremium: number, priorContract: boolean): number {
  return priorContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

export function quote({ items, years, priorContract }: { items: Item[]; years: number; priorContract: boolean }): { premium: number } {
  const policyBase = calculatePolicyBasePremium(items);
  const perItemSurcharges = calculatePerItemSurcharges(items);
  const totalDiscounts = loyaltyDiscount(policyBase, years) + followUpDiscount(policyBase, priorContract);
  const firstInsuranceSurcharges = items.length * FIRST_INSURANCE_SURCHARGE;
  return { premium: Math.ceil(policyBase + perItemSurcharges - totalDiscounts + firstInsuranceSurcharges + PROCESSING_FEE) };
}

type Damage = { itemType: string; amount: number };
type Policy = { items: Item[] };
type Incident = { cause: string; damages: Damage[] };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursementForDamage(damage: Damage, policy: Policy): number {
  const item = policy.items.find((i) => i.type === damage.itemType);
  const reimbursementRate = item && item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return damage.amount * reimbursementRate - DEDUCTIBLE;
}

export function claim({ policy, incident, remainingCap }: { policy: Policy; incident: Incident; remainingCap?: number }): { payout: number; remainingCap: number } {
  const rawPayout = incident.damages.reduce((sum, damage) => sum + reimbursementForDamage(damage, policy), 0);
  const insuranceSum = policy.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  const cap = remainingCap !== undefined ? remainingCap : CAP_MULTIPLIER * insuranceSum;
  const payout = Math.floor(Math.min(rawPayout, cap));
  return { payout, remainingCap: cap - payout };
}
