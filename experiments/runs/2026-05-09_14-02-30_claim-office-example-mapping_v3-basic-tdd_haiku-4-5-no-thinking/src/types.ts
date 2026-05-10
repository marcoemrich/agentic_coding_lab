// Item types
export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteRequest {
  items: Item[];
}

export interface QuoteResult {
  premium: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: ItemType;
  amount: number;
}

export interface ClaimIncident {
  cause: string;
  damages: Damage[];
}

export interface ClaimRequest {
  policy: number;
  incident: ClaimIncident;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioInput {
  customer: Customer;
  steps: Array<
    | { op: "quote"; items: Item[] }
    | { op: "claim"; policy: number; incident: ClaimIncident }
  >;
}

export interface ScenarioOutput {
  results: Array<QuoteResult | ClaimResult>;
}

export interface PolicyData {
  items: Item[];
  insuranceSum: number;
  cap: number;
  payout: number;
}
