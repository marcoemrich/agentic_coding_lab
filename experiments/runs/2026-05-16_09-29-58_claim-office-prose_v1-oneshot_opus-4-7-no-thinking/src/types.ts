export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentType | string;

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: ItemType;
  amount: number;
  // Optional fields when claims provide direct context
  enchantment?: number;
  material?: string;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
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

// Internal policy record, kept after a quote, so that later claims can refer to it.
export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}
