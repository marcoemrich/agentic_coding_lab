import type { Item } from "./item.js";

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS = new Map<string, PriceListEntry>([
  ["sword", { insuranceValue: 1000, basePremium: 100 }],
  ["amulet", { insuranceValue: 600, basePremium: 60 }],
  ["staff", { insuranceValue: 800, basePremium: 80 }],
  ["potion", { insuranceValue: 400, basePremium: 40 }],
]);

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

export function basePremiumOf(itemType: string): number {
  return listingOf(itemType).basePremium;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + listingOf(item.type).insuranceValue, 0);
}

export function policyBasePremium(items: Item[]): number {
  const itemTypes = [...new Set(items.map((item) => item.type))];
  return itemTypes
    .map((itemType) => alikeItemsBasePremium(itemType, items.filter((item) => item.type === itemType).length))
    .reduce((sum, basePremium) => sum + basePremium, 0);
}

function alikeItemsBasePremium(itemType: string, count: number): number {
  return isBuildingBlock(itemType, count) ? BUILDING_BLOCK_BASE_PREMIUM : count * basePremiumOf(itemType);
}

function isBuildingBlock(itemType: string, alikeCount: number): boolean {
  return isComponent(itemType) && alikeCount === BUILDING_BLOCK_SIZE;
}

function listingOf(itemType: string): PriceListEntry {
  const listing = isComponent(itemType) ? COMPONENT : MAIN_ITEMS.get(itemType);
  if (listing === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return listing;
}

function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.includes(itemType);
}
