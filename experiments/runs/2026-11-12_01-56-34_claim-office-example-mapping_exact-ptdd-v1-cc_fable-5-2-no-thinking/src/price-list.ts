import { total } from "./amounts.js";

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type PriceListEntry = { insuranceValue: number; basePremium: number };

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function mainItem(item: Item): PriceListEntry {
  if (!Object.hasOwn(MAIN_ITEMS, item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return MAIN_ITEMS[item.type];
}

function areAlike(component: Item, other: Item): boolean {
  return component.type === other.type;
}

function formsBlock(component: Item, items: Item[]): boolean {
  const alikeCount = items.filter((other) => areAlike(component, other)).length;
  return alikeCount === BLOCK_SIZE;
}

function componentBasePremium(component: Item, items: Item[]): number {
  return formsBlock(component, items) ? BLOCK_BASE_PREMIUM / BLOCK_SIZE : COMPONENT.basePremium;
}

export function itemBasePremium(item: Item, items: Item[]): number {
  return isComponent(item) ? componentBasePremium(item, items) : mainItem(item).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  return total(items.map((item) => itemBasePremium(item, items)));
}

function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT.insuranceValue : mainItem(item).insuranceValue;
}

export function insuranceSum(items: Item[]): number {
  return total(items.map(insuranceValue));
}
