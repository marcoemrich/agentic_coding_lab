const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;

export function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}
