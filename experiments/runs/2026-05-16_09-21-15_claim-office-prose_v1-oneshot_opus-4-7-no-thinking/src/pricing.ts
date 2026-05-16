import type { Item } from "./types.js";

export interface PriceEntry {
  insurance: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, PriceEntry> = {
  sword: { insurance: 1000, basePremium: 100 },
  amulet: { insurance: 600, basePremium: 60 },
  staff: { insurance: 800, basePremium: 80 },
  potion: { insurance: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_PREMIUM = 60; // for 3 alike
const COMPONENT_BUNDLE_SIZE = 3;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function getMainItemPrice(type: string): PriceEntry | undefined {
  return MAIN_ITEMS[type];
}

export function getComponentInsurance(): number {
  return COMPONENT_INSURANCE;
}

export function getComponentBasePremium(): number {
  return COMPONENT_BASE_PREMIUM;
}

export function getComponentBundlePremium(): number {
  return COMPONENT_BUNDLE_PREMIUM;
}

/**
 * Compute insurance value for an item.
 */
export function itemInsurance(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE;
  }
  const price = MAIN_ITEMS[item.type];
  if (!price) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return price.insurance;
}

/**
 * Compute insurance sum for a list of items.
 */
export function totalInsurance(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsurance(item), 0);
}

/**
 * Compute risk multiplier for an item: 1 + surcharges.
 */
export function itemRiskMultiplier(item: Item): number {
  let mult = 1;
  if (item.cursed) {
    mult += CURSED_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD) {
    mult += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return mult;
}

/**
 * A key identifying items that can be bundled together as components.
 * Items must share type, cursed status, and enchantment level (rounded
 * down by relevant threshold) to ensure surcharges match.
 */
function bundleKey(item: Item): string {
  return [
    item.type,
    item.material ?? "",
    item.cursed ? "c" : "n",
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD ? "e" : "p",
    item.enchantment ?? 0,
  ].join("|");
}

/**
 * Compute the base premium portion for the items, including the
 * component bundle special pricing, with per-item risk surcharges
 * applied.
 */
export function computeItemsPremium(items: Item[]): number {
  let total = 0;

  // Group components by bundle key so we can apply the 3-alike rule.
  const componentGroups = new Map<string, Item[]>();

  for (const item of items) {
    if (isComponent(item.type)) {
      const key = bundleKey(item);
      const list = componentGroups.get(key) ?? [];
      list.push(item);
      componentGroups.set(key, list);
      continue;
    }
    const price = getMainItemPrice(item.type);
    if (!price) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    total += price.basePremium * itemRiskMultiplier(item);
  }

  for (const group of componentGroups.values()) {
    if (group.length === 0) continue;
    const sample = group[0];
    const risk = itemRiskMultiplier(sample);
    const triples = Math.floor(group.length / COMPONENT_BUNDLE_SIZE);
    const leftover = group.length % COMPONENT_BUNDLE_SIZE;
    total += triples * COMPONENT_BUNDLE_PREMIUM * risk;
    total += leftover * COMPONENT_BASE_PREMIUM * risk;
  }

  return total;
}
