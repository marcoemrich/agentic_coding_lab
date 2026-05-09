export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';
export type Material = 'steel' | 'silver' | 'wood' | 'iron' | 'gold' | 'dragon';

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

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: Array<{
      itemType: ItemType;
      amount: number;
    }>;
  };
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

export interface Output {
  results: Result[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  totalPayoutCap: number;
  usedPayout: number;
}
