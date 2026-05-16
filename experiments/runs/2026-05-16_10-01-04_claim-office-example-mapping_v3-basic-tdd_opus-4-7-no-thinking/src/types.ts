export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = 'rune' | 'moonstone';

export interface MainItem {
  type: MainItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ComponentItem {
  type: string; // any non-main type treated as component (rune, moonstone, etc.)
}

export type Item = MainItem | ComponentItem;

export interface Customer {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 for first contract, 1 for second, etc.
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export const MAIN_ITEMS: Record<MainItemType, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

export const COMPONENT_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const BLOCK_BASE_PREMIUM = 60; // exactly 3 alike

export function isMainItem(item: Item): item is MainItem {
  return item.type in MAIN_ITEMS;
}

export function isComponentItem(item: Item): boolean {
  // Components are non-main types. We need a way to identify them.
  // We treat any unknown non-main type as a component? No — the prompt says
  // unknown types (e.g. broomstick) should error out. So we need a known list.
  // For now: rune and moonstone explicitly. We can extend, but unknown must throw.
  return item.type === 'rune' || item.type === 'moonstone';
}
