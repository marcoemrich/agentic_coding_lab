const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, component: 25,
};

const applyFactor = (amount: number, num: number, den: number) =>
  Math.ceil((amount * num) / den);

export const quote = (
  customer: { yearsWithMHPCO: number },
  items: Array<{ type: string; material: string; enchantment: number; cursed: boolean }>,
  contractNumber: number
): number => {
  const item = items[0];
  const isBulkComponents = items.length === 3 && item.type === "component";
  const base = isBulkComponents ? 60 : BASE_PREMIUM[item.type] ?? 0;
  const riskBase = item.enchantment >= 5 ? applyFactor(base, 13, 10)
                 : item.cursed ? applyFactor(base, 15, 10)
                 : base;
  const contractBase = contractNumber === 1 ? applyFactor(riskBase, 11, 10)
                                            : applyFactor(riskBase, 17, 20);
  const loyaltyBase = customer.yearsWithMHPCO >= 2 ? applyFactor(contractBase, 8, 10) : contractBase;
  return loyaltyBase + PROCESSING_FEE;
};

export const claim = (
  policy: { insuranceSum: number; remainingCap: number; items: Array<{ type: string; material: string; enchantment: number }> },
  incident: { damages: Array<{ itemType: string; amount: number }> }
): { payout: number; remainingCap: number } => {
  const damage = incident.damages[0];
  const item = policy.items.find(i => i.type === damage.itemType)!;
  const reimbursementRate = item.enchantment >= 8 && item.material !== "dragon" ? 0.5 : 1.0;
  const uncappedPayout = (damage.amount - DEDUCTIBLE) * reimbursementRate;
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
};
