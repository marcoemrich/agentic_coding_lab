import { Item } from "./types.js";
import {
  BLOCK_BASE_PREMIUM,
  BLOCK_SIZE,
  COMPONENT_BASE_PREMIUM,
  assertKnownType,
  isComponent,
  isMainItem,
  mainItemBasePremium,
} from "./catalogue.js";

export interface CustomerContext {
  yearsWithMHPCO: number;
  contractIndex: number;
}

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_RATE;
  if (isHighlyEnchanted(item)) rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return rate;
}

interface ItemLine {
  item: Item;
  basePremium: number;
}

// Compute one (item, basePremium) line per item. For component groups of exactly
// BLOCK_SIZE alike, the group's base (BLOCK_BASE_PREMIUM) is split equally so
// per-item modifiers can apply consistently.
function explodeItemLines(items: Item[]): ItemLine[] {
  const componentGroups: Record<string, Item[]> = {};
  const lines: ItemLine[] = [];

  for (const item of items) {
    if (isMainItem(item.type)) {
      lines.push({ item, basePremium: mainItemBasePremium(item.type) });
    } else if (isComponent(item.type)) {
      (componentGroups[item.type] ??= []).push(item);
    }
  }

  for (const group of Object.values(componentGroups)) {
    const perItemBase =
      group.length === BLOCK_SIZE
        ? BLOCK_BASE_PREMIUM / BLOCK_SIZE
        : COMPONENT_BASE_PREMIUM;
    for (const item of group) {
      lines.push({ item, basePremium: perItemBase });
    }
  }

  return lines;
}

export function calculatePremium(items: Item[], ctx: CustomerContext): number {
  for (const item of items) assertKnownType(item.type);

  const lines = explodeItemLines(items);
  const policyBase = lines.reduce((sum, l) => sum + l.basePremium, 0);

  let premium = policyBase;

  // Per-item surcharges (cursed, high enchantment) — applied to that item's base
  for (const line of lines) {
    premium += line.basePremium * itemSurchargeRate(line.item);
  }

  // Per-item first-insurance surcharge — each item in a quote counts as a first
  // insurance, regardless of customer history.
  for (const line of lines) {
    premium += line.basePremium * FIRST_INSURANCE_RATE;
  }

  // Policy-wide modifiers, applied to the policy base (sum of item base premiums)
  if (ctx.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    premium -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (ctx.contractIndex >= 1) {
    premium -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }

  premium += PROCESSING_FEE;

  // Premiums round up — in MHPCO's favor.
  return Math.ceil(premium);
}
