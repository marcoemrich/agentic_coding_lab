export type MainItemType = "sword" | "amulet" | "staff" | "potion";
export type ComponentItemType = "rune" | "moonstone";
export type ItemType = MainItemType | ComponentItemType;

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageInput {
  itemType: string;
  amount: number;
}

export interface IncidentInput {
  cause: string;
  damages: DamageInput[];
}

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: IncidentInput;
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface ScenarioInput {
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

export interface Policy {
  items: ItemInput[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}
