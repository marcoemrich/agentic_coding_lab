const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const ALIKE_COMPONENT_BLOCK_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function componentInsuranceValue(): number {
  return COMPONENT_INSURANCE_VALUE;
}

export function componentsBasePremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return ALIKE_COMPONENT_BLOCK_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

export function componentsBasePremiumByType(componentTypes: string[]): number {
  const counts = new Map<string, number>();
  for (const type of componentTypes) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  let premium = 0;
  for (const count of counts.values()) {
    premium += componentsBasePremium(count);
  }
  return premium;
}

export function insuranceValueOf(type: string): number {
  if (isComponent(type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  const value = MAIN_ITEM_INSURANCE_VALUES[type];
  if (value === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return value;
}

export function basePremiumOf(type: string): number {
  const basePremium = MAIN_ITEM_BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return basePremium;
}
