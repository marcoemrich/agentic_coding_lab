const AMULET_INSURANCE_VALUE = 600;
const SWORD_INSURANCE_VALUE = 1000;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;

type Item = { type: string };

function isComponent(item: Item): boolean {
  return item.type === 'rune' || item.type === 'moonstone';
}

export function insuranceValueFor(item: Item): number {
  if (item.type === 'sword') return SWORD_INSURANCE_VALUE;
  if (item.type === 'staff') return STAFF_INSURANCE_VALUE;
  if (item.type === 'potion') return POTION_INSURANCE_VALUE;
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return AMULET_INSURANCE_VALUE;
}
