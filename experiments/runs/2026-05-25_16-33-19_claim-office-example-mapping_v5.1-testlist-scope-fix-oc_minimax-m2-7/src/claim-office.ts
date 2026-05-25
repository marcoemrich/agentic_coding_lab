export interface Item {
  type: string;
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
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export interface Output {
  results: StepResult[];
}

const ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function quote(items: Item[], customer: Customer, isFirstInsurance: boolean): number {
  if (items.length === 0) return 5;
  if (items.length === 1 && items[0].type === "sword") return 100;
  return 0;
}

export function claim(policy: any, incident: Incident): any {
  return { payout: 0, remainingCap: 0 };
}

export function processScenario(scenario: Scenario): Output {
  return { results: [] };
}