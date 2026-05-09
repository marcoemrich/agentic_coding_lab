export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export const MAIN_ITEM_PRICELIST: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

export const COMPONENT_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_PREMIUM = 60;
export const COMPONENT_BLOCK_SIZE = 3;
export const PROCESSING_FEE = 5;
export const DEDUCTIBLE = 100;

export const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_PRICELIST;
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isKnownItem(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

export function itemInsuranceValue(type: string): number {
  if (isMainItem(type)) return MAIN_ITEM_PRICELIST[type].value;
  if (isComponent(type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${type}`);
}
