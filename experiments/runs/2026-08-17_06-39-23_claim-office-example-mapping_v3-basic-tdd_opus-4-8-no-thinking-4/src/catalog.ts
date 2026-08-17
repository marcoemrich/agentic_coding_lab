export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentType;

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;

interface MainItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<MainItemType, MainItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENTS: ComponentType[] = ['rune', 'moonstone'];

export function isMainItem(type: string): type is MainItemType {
  return type in MAIN_ITEMS;
}

export function isComponent(type: string): type is ComponentType {
  return (COMPONENTS as string[]).includes(type);
}

export function isKnownItemType(type: string): type is ItemType {
  return isMainItem(type) || isComponent(type);
}

export function itemInsuranceValue(type: ItemType): number {
  return isComponent(type) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEMS[type].insuranceValue;
}

export function itemBasePremium(type: ItemType): number {
  return isComponent(type) ? COMPONENT_BASE_PREMIUM : MAIN_ITEMS[type].basePremium;
}
