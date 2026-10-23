import type { Item, ItemType } from "./types.js";
import { INSURANCE_VALUE, BASE_PREMIUM } from "./quote-tables.js";

export interface QuoteInput {
  items: Item[];
  customerYears: number;
  contractIndex: number;
}

export interface QuoteResult {
  premium: number;
  insuranceSum: number;
}

export class QuoteError extends Error {}

export { INSURANCE_VALUE, BASE_PREMIUM };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

function sumOverItems(
  items: Item[],
  table: Record<ItemType, number>
): number {
  return items.reduce((sum, { type }) => sum + table[type], 0);
}

function basePremiumWithBlocks(items: Item[]): number {
  const counts = new Map<ItemType, number>();
  for (const { type } of items) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    const isComponentBlock = COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;
    total += isComponentBlock ? BLOCK_PREMIUM : count * BASE_PREMIUM[type];
  }
  return total;
}

function itemSpecificModifiers(item: Item, itemBase: number): number {
  let modifier = 0;
  if (item.cursed) modifier += CURSE_SURCHARGE_RATE * itemBase;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    modifier += HIGH_ENCHANTMENT_RATE * itemBase;
  }
  return modifier;
}

function totalItemSpecificModifiers(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += itemSpecificModifiers(item, BASE_PREMIUM[item.type]);
  }
  return total;
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new QuoteError(`Unknown item type: ${item.type}`);
    }
  }
}

export function computeQuote(input: QuoteInput): QuoteResult {
  validateItems(input.items);
  const insuranceSum = sumOverItems(input.items, INSURANCE_VALUE);
  const basePremium = basePremiumWithBlocks(input.items);
  const itemMods = totalItemSpecificModifiers(input.items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyalty =
    input.customerYears >= LOYALTY_THRESHOLD_YEARS
      ? -LOYALTY_DISCOUNT_RATE * basePremium
      : 0;
  const followUp =
    input.contractIndex >= 1 ? -FOLLOWUP_DISCOUNT_RATE * basePremium : 0;
  const subtotal =
    basePremium + itemMods + firstInsurance + loyalty + followUp + PROCESSING_FEE;
  const premium = Math.ceil(subtotal);
  return { premium, insuranceSum };
}
