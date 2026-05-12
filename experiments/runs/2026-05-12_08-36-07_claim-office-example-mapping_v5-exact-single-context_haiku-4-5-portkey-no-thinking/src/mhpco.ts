export interface QuoteRequest {
  yearsWithMHPCO: number;
}

export interface QuoteResult {
  premium: number;
  items?: Array<{ type: string }>;
}

export interface ClaimRequest {
  damages: Array<{
    itemType: string;
    amount: number;
  }>;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Item {
  type: string;
}

const itemBasePremiums: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const itemInsuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const getItemBasePremium = (item: Item): number => {
  return itemBasePremiums[item.type] ?? 0;
};

const getItemInsuranceValue = (item: Item): number => {
  return itemInsuranceValues[item.type] ?? 0;
};

const sumItemValues = (items: Array<Item>, getter: (item: Item) => number): number => {
  return items.reduce((sum, item) => sum + getter(item), 0);
};

export const quote = (customer: QuoteRequest, items: unknown[]): QuoteResult => {
  const itemList = items as Array<Item>;
  const basePremium = sumItemValues(itemList, getItemBasePremium);

  return {
    premium: basePremium + 5, // Base premium + processing fee
    items: itemList,
  };
};

export const claim = (
  customer: QuoteRequest,
  policy: QuoteResult,
  claimRequest: ClaimRequest
): ClaimResult => {
  const deductible = 100;
  const totalPayout = claimRequest.damages.reduce(
    (sum, damage) => sum + Math.max(0, damage.amount - deductible),
    0
  );

  // Calculate insurance sum from policy items
  const insuranceSum = sumItemValues(policy.items || [], getItemInsuranceValue);
  const cap = insuranceSum * 2;
  const remainingCap = cap - totalPayout;

  return {
    payout: totalPayout,
    remainingCap: remainingCap,
  };
};
