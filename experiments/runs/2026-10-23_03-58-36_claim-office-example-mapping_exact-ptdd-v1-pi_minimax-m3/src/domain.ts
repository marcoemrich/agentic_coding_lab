// Domain types and shapes for the MHPCO Claim Office kata.

export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export type MainItemType = "sword" | "amulet" | "staff" | "potion";
export type ComponentType = "rune" | "moonstone";

export interface QuoteItem {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntry {
  itemType: ItemType;
  amount: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
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

export interface ScenarioResults {
  results: Result[];
}

export interface Policy {
  items: QuoteItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

// Pricing constants from the MHPCO price list.

export const MAIN_ITEM_INSURANCE: Record<MainItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

export const MAIN_ITEM_BASE_PREMIUM: Record<MainItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export const COMPONENT_INSURANCE: Record<ComponentType, number> = {
  rune: 250,
  moonstone: 250,
};

export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;
export const CAP_MULTIPLIER = 2;

export const PROCESSING_FEE = 5;
export const DEDUCTIBLE_PER_EVENT = 100;

export const LOYALTY_THRESHOLD_YEARS = 2;
export const LOYALTY_DISCOUNT_RATE = 0.2;
export const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
export const FOLLOW_UP_DISCOUNT_RATE = 0.15;
export const CURSED_SURCHARGE_RATE = 0.5;

export const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
export const HIGH_ENCHANTMENT_PREMIUM_RATE = 0.3;

export const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
export const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// MHPCO favors itself: premium rounds up, payout rounds down.

export const PREMIUM_ROUNDING_DIRECTION = "up" as const;
export const PAYOUT_ROUNDING_DIRECTION = "down" as const;

// Domain error used by quote and claim when an input violates the rules.
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
