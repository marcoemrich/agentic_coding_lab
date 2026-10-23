import type { QuoteItem } from "./claim-office.js";

const SWORD_BASE_PREMIUM = 100;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_BASE_PREMIUM = 60;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_BASE_PREMIUM = 80;
const STAFF_INSURANCE_VALUE = 800;
const POTION_BASE_PREMIUM = 40;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

interface ItemPriceEntry {
  insuranceValue: number;
  basePremium: number;
}

const ITEM_PRICE_LIST: Record<string, ItemPriceEntry> = {
  sword: {
    insuranceValue: SWORD_INSURANCE_VALUE,
    basePremium: SWORD_BASE_PREMIUM,
  },
  amulet: {
    insuranceValue: AMULET_INSURANCE_VALUE,
    basePremium: AMULET_BASE_PREMIUM,
  },
  staff: {
    insuranceValue: STAFF_INSURANCE_VALUE,
    basePremium: STAFF_BASE_PREMIUM,
  },
  potion: {
    insuranceValue: POTION_INSURANCE_VALUE,
    basePremium: POTION_BASE_PREMIUM,
  },
  rune: {
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    basePremium: COMPONENT_BASE_PREMIUM,
  },
  moonstone: {
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    basePremium: COMPONENT_BASE_PREMIUM,
  },
};

function getItemPriceEntry(itemType: string): ItemPriceEntry {
  const entry = ITEM_PRICE_LIST[itemType];
  if (!entry) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}

export function getItemBasePremium(itemType: string): number {
  return getItemPriceEntry(itemType).basePremium;
}

export function getItemInsuranceValue(itemType: string): number {
  return getItemPriceEntry(itemType).insuranceValue;
}

function calculateComponentBlockAdjustment(items: QuoteItem[]): number {
  const blockCount = COMPONENT_TYPES.filter(
    (componentType) =>
      items.filter((item) => item.type === componentType).length ===
      COMPONENT_BLOCK_SIZE,
  ).length;
  return (
    blockCount *
    (COMPONENT_BLOCK_BASE_PREMIUM - COMPONENT_BLOCK_SIZE * COMPONENT_BASE_PREMIUM)
  );
}

export function calculatePolicyBasePremium(items: QuoteItem[]): number {
  const rawBasePremium = items.reduce(
    (sum, item) => sum + getItemBasePremium(item.type),
    0,
  );
  return rawBasePremium + calculateComponentBlockAdjustment(items);
}
