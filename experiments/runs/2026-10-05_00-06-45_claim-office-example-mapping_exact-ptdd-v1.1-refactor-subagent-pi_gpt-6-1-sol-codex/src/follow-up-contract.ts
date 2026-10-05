const FOLLOW_UP_RATE = 0.15;

export function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * FOLLOW_UP_RATE : 0;
}
