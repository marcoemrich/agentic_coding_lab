export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: ItemType;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Policy {
  insuranceSum: number;
  cap: number;
  items: Item[];
  remainingCap: number;
}

export interface QuoteResult {
  premium: number;
  policy: Policy;
}

export interface Damage {
  itemType: ItemType;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
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

export interface ScenarioResult {
  results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
}
