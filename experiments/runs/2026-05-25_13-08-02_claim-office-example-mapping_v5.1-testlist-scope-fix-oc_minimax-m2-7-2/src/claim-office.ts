export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuranceItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimDamage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: InsuranceItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function calculatePremium(params: {
  items: InsuranceItem[];
  customer: Customer;
  quoteCount: number;
}): number {
  return undefined as any;
}

export function processClaim(params: {
  policy: Policy;
  incident: {
    cause: string;
    damages: ClaimDamage[];
  };
}): { payout: number; remainingCap: number } {
  return { payout: 0, remainingCap: 0 };
}