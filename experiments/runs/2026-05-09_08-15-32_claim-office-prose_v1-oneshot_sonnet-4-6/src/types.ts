export interface Customer {
  yearsWithMHPCO: number;
}

export interface ItemSpec {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: ItemSpec[];
}

export interface Damage {
  itemType: string;
  amount: number;
  enchantment?: number;
  material?: string;
}

export interface Incident {
  cause: string;
  damages: Damage[];
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

export type StepResult = QuoteResult | ClaimResult;

export interface Output {
  results: StepResult[];
}

export interface Policy {
  items: ItemSpec[];
  insuranceSum: number;
  remainingCap: number;
}
