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

export interface ItemPriceEntry {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
}

const ITEM_PRICE_LIST: Record<string, ItemPriceEntry> = {
  sword: {
    basePremium: SWORD_BASE_PREMIUM,
    insuranceValue: SWORD_INSURANCE_VALUE,
    isComponent: false,
  },
  amulet: {
    basePremium: AMULET_BASE_PREMIUM,
    insuranceValue: AMULET_INSURANCE_VALUE,
    isComponent: false,
  },
  staff: {
    basePremium: STAFF_BASE_PREMIUM,
    insuranceValue: STAFF_INSURANCE_VALUE,
    isComponent: false,
  },
  potion: {
    basePremium: POTION_BASE_PREMIUM,
    insuranceValue: POTION_INSURANCE_VALUE,
    isComponent: false,
  },
  rune: {
    basePremium: COMPONENT_BASE_PREMIUM,
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    isComponent: true,
  },
  moonstone: {
    basePremium: COMPONENT_BASE_PREMIUM,
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    isComponent: true,
  },
};

export function getPriceListEntry(type: string): ItemPriceEntry {
  const entry = ITEM_PRICE_LIST[type];
  if (!entry) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
}

export function getItemBasePremium(type: string): number {
  return getPriceListEntry(type).basePremium;
}

export function getItemInsuranceValue(type: string): number {
  return getPriceListEntry(type).insuranceValue;
}
