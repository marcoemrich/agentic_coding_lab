export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
const processingFee = 5;
const basePrices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const firstAssessment = 0.1;
const curseRate = 0.5;
const loyaltyYears = 2;
const loyaltyRate = 0.2;
const highEnchantment = 5;
const enchantmentRate = 0.3;
const followUpRate = 0.15;

const blockSize = 3;
const blockBase = 60;

function isComponentBlock(items: Item[]): boolean {
  return items.length === blockSize && ['rune', 'moonstone'].includes(items[0].type);
}

function listedBasePremium(type: string): number {
  if (!Object.hasOwn(basePrices, type)) throw new Error(`Unknown item type: ${type}`);
  return basePrices[type];
}

function alikeBasePremium(items: Item[]): number {
  return isComponentBlock(items) ? blockBase : items.length * listedBasePremium(items[0].type);
}

function basePremium(items: Item[]): number {
  const types = [...new Set(items.map(item => item.type))];
  return types.reduce((total, type) => {
    const alike = items.filter(item => item.type === type);
    return total + alikeBasePremium(alike);
  }, 0);
}

function curseSurcharge(items: Item[]): number {
  return items.reduce((total, item) => total + (item.cursed ? listedBasePremium(item.type) * curseRate : 0), 0);
}

function enchantmentSurcharge(items: Item[]): number {
  return items.reduce((total, item) => total + ((item.enchantment ?? 0) >= highEnchantment ? listedBasePremium(item.type) * enchantmentRate : 0), 0);
}

function loyaltyDiscount(base: number, years: number): number {
  return years >= loyaltyYears ? base * loyaltyRate : 0;
}

function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * followUpRate : 0;
}

export function quotePremium(items: Item[], years: number, previousContracts = 0): number {
  const base = basePremium(items);
  const curse = curseSurcharge(items);
  const loyalty = loyaltyDiscount(base, years);
  const enchantment = enchantmentSurcharge(items);
  const followUp = followUpDiscount(base, previousContracts);
  return Math.ceil(base + curse + enchantment + base * firstAssessment - loyalty - followUp + processingFee);
}
