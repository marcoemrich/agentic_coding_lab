export interface Customer {
  yearsWithMHPCO: number;
}

export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = string; // any other type like 'rune', 'moonstone' etc.

export interface MainItem {
  type: MainItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ComponentItem {
  type: string; // not one of the main types
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export type Item = MainItem | ComponentItem;

export interface Damage {
  itemType: string;
  amount: number;
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

export interface ScenarioResults {
  results: StepResult[];
}

export const MAIN_ITEMS: Record<MainItemType, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_PREMIUM = 60;

export const COMPONENT_TYPES = new Set<string>(['rune', 'moonstone']);

export function isMainItemType(t: string): t is MainItemType {
  return t === 'sword' || t === 'amulet' || t === 'staff' || t === 'potion';
}

export function isComponentType(t: string): boolean {
  return COMPONENT_TYPES.has(t);
}

export function isKnownItemType(t: string): boolean {
  return isMainItemType(t) || isComponentType(t);
}
