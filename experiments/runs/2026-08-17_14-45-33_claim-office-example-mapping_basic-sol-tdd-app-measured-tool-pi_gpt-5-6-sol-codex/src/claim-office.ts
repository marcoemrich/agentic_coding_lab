export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_REDUCTION = 15;
const CURSE_SURCHARGE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const INITIAL_ASSESSMENT_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function componentBlockReduction(items: Item[], componentType: string): number {
  const alikeCount = items.filter((item) => item.type === componentType).length;
  return alikeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_REDUCTION : 0;
}

function customerHistoryAdjustment(policyBasePremium: number, yearsWithMHPCO: number, contractNumber: number): number {
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? policyBasePremium * LOYALTY_DISCOUNT : 0;
  const initialAssessment = contractNumber >= 0 ? policyBasePremium * INITIAL_ASSESSMENT_SURCHARGE : 0;
  const followUpDiscount = contractNumber > 0 ? policyBasePremium * FOLLOW_UP_DISCOUNT : 0;
  return initialAssessment - loyaltyDiscount - followUpDiscount;
}

export function quote(items: Item[], yearsWithMHPCO: number, contractNumber: number): { premium: number; policy: Policy } {
  const unknownItem = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknownItem !== undefined) throw new Error(`Unknown item type: ${unknownItem.type}`);
  const itemPremium = items.reduce((total, item) => total + (BASE_PREMIUM[item.type] ?? 0), 0);
  const blockReductions = componentBlockReduction(items, "rune") + componentBlockReduction(items, "moonstone");
  const policyBasePremium = itemPremium - blockReductions;
  const curseSurcharge = items.reduce((total, item) => total + (item.cursed ? (BASE_PREMIUM[item.type] ?? 0) * CURSE_SURCHARGE : 0), 0);
  const enchantmentSurcharge = items.reduce((total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? (BASE_PREMIUM[item.type] ?? 0) * ENCHANTMENT_SURCHARGE : 0), 0);
  const historyAdjustment = customerHistoryAdjustment(policyBasePremium, yearsWithMHPCO, contractNumber);
  const insuranceSum = items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);
  const premium = policyBasePremium + curseSurcharge + enchantmentSurcharge + historyAdjustment + PROCESSING_FEE;
  return { premium: Math.ceil(premium), policy: { items, remainingCap: insuranceSum * CAP_MULTIPLIER } };
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  return (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? amount * ENCHANTED_REIMBURSEMENT : amount;
}

function matchDamagedItems(policy: Policy, damages: Damage[]): Item[] {
  const availableItems = [...policy.items];
  return damages.map((damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    return availableItems.splice(itemIndex, 1)[0];
  });
}

export function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage !== undefined) throw new Error(`Damage amount cannot be negative: ${String(negativeDamage.amount)}`);
  const damagedItems = matchDamagedItems(policy, damages);
  const desiredPayout = damages.reduce((total, damage, index) => {
    return total + Math.max(reimbursableDamage(damagedItems[index], damage.amount) - DEDUCTIBLE, 0);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
