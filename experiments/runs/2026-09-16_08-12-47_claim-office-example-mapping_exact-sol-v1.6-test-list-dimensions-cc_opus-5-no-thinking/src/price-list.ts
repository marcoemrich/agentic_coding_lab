/** The MHPCO price list: published insurance value and base premium per item type. */
const SWORD_BASE_PREMIUM_IN_G = 100;
const AMULET_BASE_PREMIUM_IN_G = 60;
const STAFF_BASE_PREMIUM_IN_G = 80;
const POTION_BASE_PREMIUM_IN_G = 40;
const COMPONENT_BASE_PREMIUM_IN_G = 25;

const SWORD_INSURANCE_VALUE_IN_G = 1000;
const AMULET_INSURANCE_VALUE_IN_G = 600;
const STAFF_INSURANCE_VALUE_IN_G = 800;
const POTION_INSURANCE_VALUE_IN_G = 400;
const COMPONENT_INSURANCE_VALUE_IN_G = 250;

const BASE_PREMIUM_IN_G: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM_IN_G,
  amulet: AMULET_BASE_PREMIUM_IN_G,
  staff: STAFF_BASE_PREMIUM_IN_G,
  potion: POTION_BASE_PREMIUM_IN_G,
  rune: COMPONENT_BASE_PREMIUM_IN_G,
  moonstone: COMPONENT_BASE_PREMIUM_IN_G,
};

const INSURANCE_VALUE_IN_G: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE_IN_G,
  amulet: AMULET_INSURANCE_VALUE_IN_G,
  staff: STAFF_INSURANCE_VALUE_IN_G,
  potion: POTION_INSURANCE_VALUE_IN_G,
  rune: COMPONENT_INSURANCE_VALUE_IN_G,
  moonstone: COMPONENT_INSURANCE_VALUE_IN_G,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

export function basePremiumOf(itemType: string): number {
  const basePremium = BASE_PREMIUM_IN_G[itemType];
  if (basePremium === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return basePremium;
}

export function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.includes(itemType);
}

export function insuranceValueOf(itemType: string): number {
  const insuranceValue = INSURANCE_VALUE_IN_G[itemType];
  if (insuranceValue === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return insuranceValue;
}
