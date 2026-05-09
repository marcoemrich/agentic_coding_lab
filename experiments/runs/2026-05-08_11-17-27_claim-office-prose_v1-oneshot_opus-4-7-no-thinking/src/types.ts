export type MainItemType = "sword" | "amulet" | "staff" | "potion";

export interface Item {
  type: string; // main type or component type (e.g. "rune", "moonstone")
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
  // optional fields about the item; falls back to looking up in the policy
  enchantment?: number;
  material?: string;
}

export interface Incident {
  cause?: string;
  damages: DamageEntry[];
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

export interface ScenarioResult {
  results: StepResult[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number; // starts at 2 * insuranceSum
}
