const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

export interface CustomerHistory {
  yearsWithMHPCO: number;
  hasPreviousContract: boolean;
}

export function policyModifierPercent(history: CustomerHistory): number {
  const loyaltyDiscount = history.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpDiscount = history.hasPreviousContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyDiscount - followUpDiscount;
}
