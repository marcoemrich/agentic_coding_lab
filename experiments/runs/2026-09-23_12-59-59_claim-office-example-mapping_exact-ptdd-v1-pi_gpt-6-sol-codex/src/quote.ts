export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const COMPONENT_TYPES = ['rune', 'moonstone'];

function componentBase(items: Item[], type: string) {
  const count = items.filter(item => item.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_BASE : count * BASE_PREMIUM[type];
}

export function basePremium(items: Item[]) {
  const main = items.filter(item => !COMPONENT_TYPES.includes(item.type))
    .reduce((sum, item) => sum + (BASE_PREMIUM[item.type] ?? 0), 0);
  return main + COMPONENT_TYPES.reduce((sum, type) => sum + componentBase(items, type), 0);
}

function itemRiskSurcharge(item: Item) {
  const rate = (item.cursed ? CURSE_RATE : 0) +
    ((item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD ? ENCHANTMENT_RATE : 0);
  return (BASE_PREMIUM[item.type] ?? 0) * rate;
}

function customerAdjustment(base: number, yearsWithMHPCO: number, followUp: boolean) {
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return base * ASSESSMENT_RATE - loyalty - followUpDiscount;
}

export function premium(items: Item[], yearsWithMHPCO = 0, followUp = false) {
  for (const item of items) {
    if (BASE_PREMIUM[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
  const base = basePremium(items);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  return Math.ceil(base + risk + customerAdjustment(base, yearsWithMHPCO, followUp) + PROCESSING_FEE);
}
