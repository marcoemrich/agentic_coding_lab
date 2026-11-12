interface MainItemRow {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, MainItemRow> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.includes(itemType);
}

function mainItem(itemType: string): MainItemRow {
  if (!Object.hasOwn(MAIN_ITEMS, itemType)) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return MAIN_ITEMS[itemType];
}

export function basePremiumOf(itemType: string): number {
  return isComponent(itemType) ? COMPONENT_BASE_PREMIUM : mainItem(itemType).basePremium;
}

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function mainItemsBasePremium(itemTypes: string[]): number {
  return itemTypes
    .filter((itemType) => !isComponent(itemType))
    .reduce((sum, itemType) => sum + basePremiumOf(itemType), 0);
}

// "Alike" components are components of exactly the same type.
function componentsBasePremium(itemTypes: string[]): number {
  return COMPONENT_TYPES.reduce((sum, componentType) => {
    const alikeComponents = itemTypes.filter((itemType) => itemType === componentType);
    return sum + alikeComponentsBasePremium(alikeComponents.length);
  }, 0);
}

export function policyBasePremium(itemTypes: string[]): number {
  return mainItemsBasePremium(itemTypes) + componentsBasePremium(itemTypes);
}

function insuranceValueOf(itemType: string): number {
  return isComponent(itemType) ? COMPONENT_INSURANCE_VALUE : mainItem(itemType).insuranceValue;
}

export function insuranceSum(itemTypes: string[]): number {
  return itemTypes.reduce((sum, itemType) => sum + insuranceValueOf(itemType), 0);
}
