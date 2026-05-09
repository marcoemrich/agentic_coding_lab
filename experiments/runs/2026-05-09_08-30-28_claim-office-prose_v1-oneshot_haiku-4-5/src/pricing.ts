import { Item, Customer } from './types.js';

const BASE_PRICES: Record<string, { insurance: number; basePremium: number }> = {
  sword: { insurance: 1000, basePremium: 100 },
  amulet: { insurance: 600, basePremium: 60 },
  staff: { insurance: 800, basePremium: 80 },
  potion: { insurance: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

export function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  let componentCount = 0;

  for (const item of items) {
    if (BASE_PRICES[item.type]) {
      sum += BASE_PRICES[item.type].insurance;
    } else if (COMPONENT_TYPES.has(item.type)) {
      componentCount++;
    }
  }

  // Components: 250 G each
  sum += componentCount * 250;
  return sum;
}

export function calculateBasePremium(items: Item[]): number {
  let premium = 0;
  let componentsByType: Record<string, number> = {};

  for (const item of items) {
    if (BASE_PRICES[item.type]) {
      premium += BASE_PRICES[item.type].basePremium;
    } else if (COMPONENT_TYPES.has(item.type)) {
      componentsByType[item.type] = (componentsByType[item.type] || 0) + 1;
    }
  }

  // For components: groups of 3 get 60 G, others get 25 G each
  for (const [type, count] of Object.entries(componentsByType)) {
    const groupsOf3 = Math.floor(count / 3);
    const remainder = count % 3;
    premium += groupsOf3 * 60 + remainder * 25;
  }

  return premium;
}

export function applyModifiers(
  basePremium: number,
  items: Item[],
  customer: Customer,
  isFirstInsurance: boolean
): number {
  let premium = basePremium;

  // Cursed items: +50% (apply once if any cursed item)
  if (items.some((item) => item.cursed)) {
    premium = premium * 1.5;
  }

  // Enchanted items (level >= 5): +30% (apply once if any high enchantment)
  if (items.some((item) => item.enchantment >= 5)) {
    premium = premium * 1.3;
  }

  // First insurance: +10%
  if (isFirstInsurance) {
    premium = premium * 1.1;
  }

  // Long-standing customers (>= 2 years): -20%
  if (customer.yearsWithMHPCO >= 2) {
    premium = premium * 0.8;
  }

  // After first contract: -15%
  if (!isFirstInsurance) {
    premium = premium * 0.85;
  }

  // Processing fee: +5 G
  premium += 5;

  // Round up in MHPCO's favor
  return Math.round(premium);
}

export function calculatePremium(
  items: Item[],
  customer: Customer,
  isFirstInsurance: boolean
): number {
  const basePremium = calculateBasePremium(items);
  return applyModifiers(basePremium, items, customer, isFirstInsurance);
}
