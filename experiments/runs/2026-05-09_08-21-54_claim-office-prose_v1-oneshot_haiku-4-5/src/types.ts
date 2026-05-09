export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';
export type Material = 'steel' | 'silver' | 'wood' | 'crystal' | 'dragon' | string;

export interface Item {
  type: ItemType;
  material: Material;
  enchantment: number;
  cursed: boolean;
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
}

export interface Incident {
  cause: string;
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

export type Result = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: Result[];
}

export interface Policy {
  items: Item[];
  insuranceValue: number;
  premiumPaid: number;
  paidOut: number;
}
