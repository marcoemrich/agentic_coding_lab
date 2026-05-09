export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentType;

export interface MainItem {
  type: MainItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ComponentItem {
  type: ComponentType;
}

export type Item = MainItem | ComponentItem;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: ItemType;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export const MAIN_ITEM_VALUES: Record<MainItemType, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

export const COMPONENT_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_PREMIUM = 60;

export const COMPONENT_TYPES: ComponentType[] = ['rune', 'moonstone'];

export function isComponent(item: Item): item is ComponentItem {
  return COMPONENT_TYPES.includes(item.type as ComponentType);
}

export function isMainItem(item: Item): item is MainItem {
  return !isComponent(item);
}

export function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_VALUE;
  return MAIN_ITEM_VALUES[item.type].value;
}
