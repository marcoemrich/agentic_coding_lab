const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const FIRST_ASSESSMENT_PERCENT = 10;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CURSE_PERCENT = 50;
const ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_PERCENT = 30;
const FOLLOW_UP_PERCENT = 15;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;

export function insuranceSum(items: { type: string }[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

function componentBlockSaving(items: { type: string }[]): number {
  return ['rune', 'moonstone'].reduce((saving, type) => {
    const count = items.filter(item => item.type === type).length;
    return saving + (count === BLOCK_SIZE ? BLOCK_SAVING : 0);
  }, 0);
}

function itemRiskSurcharge(items: { type: string; cursed?: boolean; enchantment?: number }[]): number {
  return items.reduce((sum, item) => {
    const risk = (item.cursed ? CURSE_PERCENT : 0) + ((item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD ? ENCHANTMENT_PERCENT : 0);
    return sum + BASE_PREMIUM[item.type] * risk / PERCENT;
  }, 0);
}

function policyAdjustmentPercent(quoteIndex: number, yearsWithMHPCO: number): number {
  return FIRST_ASSESSMENT_PERCENT - (quoteIndex > 0 ? FOLLOW_UP_PERCENT : 0)
    - (yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0);
}

export function premium(items: { type: string; cursed?: boolean; enchantment?: number }[], quoteIndex = 0, yearsWithMHPCO = 0): number {
  for (const item of items) {
    if (!Object.hasOwn(BASE_PREMIUM, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const base = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0)
    - componentBlockSaving(items);
  const policyPercent = policyAdjustmentPercent(quoteIndex, yearsWithMHPCO);
  return Math.ceil(base + itemRiskSurcharge(items) + base * policyPercent / PERCENT + PROCESSING_FEE);
}
