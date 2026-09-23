export type InsuredItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: InsuredItem[] };

export type Damage = { itemType: string; amount: number };

export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
};

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };
