export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface QuoteResult {
  premium: number;
  insuranceSum: number;
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

export const COMPONENT_TYPES: ReadonlySet<string> = new Set(['rune', 'moonstone']);

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_SPEC: ItemSpec = {
  insuranceValue: 250,
  basePremium: 25,
};

export const COMPONENT_BUNDLE_BASE_PREMIUM = 60;
export const PROCESSING_FEE = 5;
export const DEDUCTIBLE_PER_INCIDENT = 100;
