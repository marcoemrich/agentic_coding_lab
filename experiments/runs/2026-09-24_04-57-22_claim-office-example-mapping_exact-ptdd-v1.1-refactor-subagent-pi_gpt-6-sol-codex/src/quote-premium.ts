const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ['rune', 'moonstone'];

function basePremiumFor(item: { type: string }): number {
  if (item.type === 'amulet') return AMULET_BASE_PREMIUM;
  if (item.type === 'staff') return STAFF_BASE_PREMIUM;
  if (item.type === 'potion') return POTION_BASE_PREMIUM;
  if (COMPONENT_TYPES.includes(item.type)) return COMPONENT_BASE_PREMIUM;
  if (item.type === 'sword') return SWORD_BASE_PREMIUM;
  throw new Error(`Unknown item type: ${item.type}`);
}

function basePremiumForAlikeComponents(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function basePremiumForComponents(items: { type: string }[]): number {
  return COMPONENT_TYPES.reduce((sum, type) => {
    const count = items.filter(item => item.type === type).length;
    return sum + basePremiumForAlikeComponents(count);
  }, 0);
}

function policyBasePremium(items: { type: string }[]): number {
  return basePremiumForComponents(items) + items.filter(item => !COMPONENT_TYPES.includes(item.type))
    .reduce((sum, item) => sum + basePremiumFor(item), 0);
}

function cursedItemSurcharge(items: { type: string; cursed?: boolean }[]): number {
  return items.reduce((sum, item) => sum + (item.cursed ? basePremiumFor(item) * CURSE_SURCHARGE : 0), 0);
}

function highEnchantmentSurcharge(items: { type: string; enchantment?: number }[]): number {
  return items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? basePremiumFor(item) * ENCHANTMENT_SURCHARGE : 0), 0);
}

function itemRiskSurcharges(items: { type: string; cursed?: boolean; enchantment?: number }[]): number {
  return cursedItemSurcharge(items) + highEnchantmentSurcharge(items);
}

function firstInsuranceAssessment(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE;
}

function qualifiesForLoyaltyDiscount(yearsWithMHPCO: number): boolean {
  return yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return qualifiesForLoyaltyDiscount(yearsWithMHPCO) ? basePremium * LOYALTY_DISCOUNT : 0;
}

function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts ? basePremium * FOLLOW_UP_DISCOUNT : 0;
}

function roundPremiumInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

function premiumBeforeProcessingFee(items: { type: string; cursed?: boolean; enchantment?: number }[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  return basePremium + itemRiskSurcharges(items) + firstInsuranceAssessment(basePremium) - loyaltyDiscount(basePremium, yearsWithMHPCO) - followUpContractDiscount(basePremium, previousContracts);
}

export function quotePremium(items: { type: string; cursed?: boolean; enchantment?: number }[], yearsWithMHPCO = 0, previousContracts = 0): number {
  return roundPremiumInMHPCOFavor(premiumBeforeProcessingFee(items, yearsWithMHPCO, previousContracts) + PROCESSING_FEE);
}
