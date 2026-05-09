export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimDamage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: ClaimDamage[];
}

export interface ClaimStep {
  op: "claim";
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

export interface ScenarioResponse {
  results: Result[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}
