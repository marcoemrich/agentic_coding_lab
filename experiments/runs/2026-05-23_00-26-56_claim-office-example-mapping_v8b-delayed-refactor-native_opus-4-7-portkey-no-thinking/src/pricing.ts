import { Item } from "./types.js";

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isKnownItemType(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

function assertKnown(type: string): void {
  if (!isKnownItemType(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

export function itemInsuranceValue(item: Item): number {
  assertKnown(item.type);
  if (isMainItem(item.type)) return MAIN_ITEMS[item.type].value;
  return COMPONENT_VALUE;
}

export function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function componentGroupPremium(count: number): number {
  // The "building block" discount applies only when the group is exactly 3 alike components.
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_PREMIUM;
}

function countComponentsByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
}

export function computePolicyBasePremium(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (isMainItem(item.type)) {
      total += MAIN_ITEMS[item.type].premium;
    }
  }
  for (const [, count] of countComponentsByType(items)) {
    total += componentGroupPremium(count);
  }
  return total;
}

function itemSurchargeAmount(item: Item): number {
  if (!isMainItem(item.type)) return 0;
  const base = MAIN_ITEMS[item.type].premium;
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
}

function policyAdjustmentRate(ctx: QuoteContext): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (ctx.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) rate -= LOYALTY_DISCOUNT_RATE;
  if (ctx.isFollowUpContract) rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  return rate;
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  for (const item of items) assertKnown(item.type);

  if (items.length === 0) return PROCESSING_FEE;

  const policyBase = computePolicyBasePremium(items);
  const itemSurcharges = items.reduce((s, i) => s + itemSurchargeAmount(i), 0);
  const policyAdjustments = policyBase * policyAdjustmentRate(ctx);

  const total = policyBase + itemSurcharges + policyAdjustments + PROCESSING_FEE;

  // Round up — in MHPCO's favor for the premium.
  return Math.ceil(total);
}
