export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = string; // e.g. 'rune', 'moonstone'

export interface MainItem {
  type: MainItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ComponentItem {
  type: string; // e.g. 'rune', 'moonstone'
  material?: string;
}

export type Item = MainItem | ComponentItem;

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number; // step index of the quote
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface ScenarioOutput {
  results: StepResult[];
}

// Internal policy state tracked during scenario processing
export interface PolicyState {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export const MAIN_ITEM_DATA: Record<MainItemType, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

export const COMPONENT_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_PREMIUM = 60;
export const PROCESSING_FEE = 5;

export const MAIN_ITEM_TYPES = new Set<string>(['sword', 'amulet', 'staff', 'potion']);

export function isMainItem(item: Item): item is MainItem {
  return MAIN_ITEM_TYPES.has(item.type);
}
