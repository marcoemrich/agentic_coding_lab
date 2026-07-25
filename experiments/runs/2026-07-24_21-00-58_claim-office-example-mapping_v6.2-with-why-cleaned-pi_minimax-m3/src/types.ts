export type ItemType =
  | "sword"
  | "amulet"
  | "staff"
  | "potion"
  | "rune"
  | "moonstone";

export type Item = {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
  contractCount: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Policy = {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;
export type ScenarioResult = { results: StepResult[] };
