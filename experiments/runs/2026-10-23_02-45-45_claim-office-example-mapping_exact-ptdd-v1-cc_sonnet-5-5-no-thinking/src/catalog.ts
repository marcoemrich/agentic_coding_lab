import { ClaimOfficeError } from "./claim-office-error.js";

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const SWORD_INSURANCE_VALUE = 1000;
const SWORD_BASE_PREMIUM = 100;
const AMULET_INSURANCE_VALUE = 600;
const AMULET_BASE_PREMIUM = 60;
const STAFF_INSURANCE_VALUE = 800;
const STAFF_BASE_PREMIUM = 80;
const POTION_INSURANCE_VALUE = 400;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;

function mainItem(insuranceValue: number, basePremium: number): PriceListEntry {
  return { insuranceValue, basePremium, component: false };
}

function component(): PriceListEntry {
  return {
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    basePremium: COMPONENT_BASE_PREMIUM,
    component: true,
  };
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: mainItem(SWORD_INSURANCE_VALUE, SWORD_BASE_PREMIUM),
  amulet: mainItem(AMULET_INSURANCE_VALUE, AMULET_BASE_PREMIUM),
  staff: mainItem(STAFF_INSURANCE_VALUE, STAFF_BASE_PREMIUM),
  potion: mainItem(POTION_INSURANCE_VALUE, POTION_BASE_PREMIUM),
  rune: component(),
  moonstone: component(),
};

function entryOf(type: string): PriceListEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) {
    throw new ClaimOfficeError(`Unknown item type: ${type}`);
  }
  return PRICE_LIST[type];
}

export function insuranceValueOf(type: string): number {
  return entryOf(type).insuranceValue;
}

export function basePremiumOf(type: string): number {
  return entryOf(type).basePremium;
}

export function isComponent(type: string): boolean {
  return entryOf(type).component;
}
