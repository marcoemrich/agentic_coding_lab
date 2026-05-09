import type { Item } from "./types.js";

export const MAIN_ITEMS: Record<string, { insured: number; base: number }> = {
  sword: { insured: 1000, base: 100 },
  amulet: { insured: 600, base: 60 },
  staff: { insured: 800, base: 80 },
  potion: { insured: 400, base: 40 },
};

export const COMPONENT_INSURED = 250;
export const COMPONENT_BASE = 25;
export const COMPONENT_BUNDLE_BASE = 60;
export const COMPONENT_BUNDLE_SIZE = 3;
export const PROCESSING_FEE = 5;

export const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEMS;
}

export function isComponent(item: Item): boolean {
  return !isMainItem(item);
}

export function itemInsuredValue(item: Item): number {
  if (isMainItem(item)) return MAIN_ITEMS[item.type].insured;
  return COMPONENT_INSURED;
}

export function itemBasePremium(item: Item): number {
  if (isMainItem(item)) return MAIN_ITEMS[item.type].base;
  return COMPONENT_BASE;
}

/** Apply per-item risk surcharges (cursed, high enchantment) to a base premium. */
export function applyItemModifiers(item: Item, base: number): number {
  let factor = 1;
  if (item.cursed) factor += 0.5;
  if ((item.enchantment ?? 0) >= 5) factor += 0.3;
  return base * factor;
}
