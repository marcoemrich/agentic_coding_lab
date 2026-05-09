export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentItemType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentItemType;

export interface MainItem {
  type: MainItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ComponentItem {
  type: ComponentItemType;
}

export type Item = MainItem | ComponentItem;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: ItemType;
  amount: number;
  // material/enchantment may be absent — claims look up the insured item by type
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

export const MAIN_ITEM_BASE_PREMIUM: Record<MainItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export const MAIN_ITEM_INSURANCE_VALUE: Record<MainItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

export const COMPONENT_TYPES: ReadonlySet<string> = new Set<string>(['rune', 'moonstone']);
export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_OF_3_BASE_PREMIUM = 60;

export function isComponent(item: Item): item is ComponentItem {
  return COMPONENT_TYPES.has(item.type);
}

export function isMainItem(item: Item): item is MainItem {
  return item.type in MAIN_ITEM_BASE_PREMIUM;
}
