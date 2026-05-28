const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function calculateInsuranceSum(items: { type: string }[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

export function processClaim(
  policyItems: Item[],
  _insuranceSum: number,
  remainingCap: number,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  const available: Record<string, number> = {};
  for (const item of policyItems) {
    available[item.type] = (available[item.type] || 0) + 1;
  }

  let payout = 0;
  for (const damage of damages) {
    const count = available[damage.itemType] || 0;
    if (count <= 0) {
      throw new Error(`No more "${damage.itemType}" items available in policy`);
    }
    available[damage.itemType] = count - 1;

    const item = policyItems.find((i) => i.type === damage.itemType);
    let reimbursement = damage.amount;
    if ((item?.enchantment || 0) >= 8) reimbursement = reimbursement * 0.5;
    payout += Math.max(0, reimbursement - 100);
  }
  if (payout > remainingCap) payout = remainingCap;
  return { payout: Math.floor(payout), remainingCap: remainingCap - payout };
}