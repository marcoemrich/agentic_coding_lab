export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export const ITEM_INSURANCE_VALUES: Readonly<Record<ItemType, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export const ITEM_BASE_PREMIUMS: Readonly<Record<ItemType, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export const PROCESSING_FEE = 5;
export const DEDUCTIBLE_PER_DAMAGE = 100;
export const HIGH_ENCHANTMENT_THRESHOLD = 5;
export const DAMAGE_REIMBURSEMENT_THRESHOLD = 8;

export const FIRST_INSURANCE_RATE = 0.1;
export const CURSED_SURCHARGE_RATE = 0.5;
export const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
export const LOYALTY_DISCOUNT_RATE = 0.2;
export const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
export const HIGH_ENCHANTMENT_DAMAGE_RATE = 0.5;
export const CAP_MULTIPLIER = 2;
export const LOYALTY_THRESHOLD = 2;

export function isValidItemType(type: string): type is ItemType {
  return type in ITEM_INSURANCE_VALUES;
}

export function isComponent(type: ItemType): boolean {
  return COMPONENT_TYPES.has(type);
}

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  premium: number;
}

export interface QuoteInput {
  customer: Customer;
  items: ItemInput[];
  quoteNumber: number;
}

export interface QuoteResult {
  premium: number;
  policy: Policy;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Damage {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Damage;
}

export type Step = QuoteStep | ClaimStep;

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioInput {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioOutput {
  results: StepResult[];
}
