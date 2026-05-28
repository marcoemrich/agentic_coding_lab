export interface Damage {
  itemType: string;
  amount: number;
}

export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
}

export function calculatePayout(
  policyItems: PolicyItem[],
  damages: Damage[],
  insuranceSum: number,
  remainingCap: number
): { payout: number; remainingCap: number } {
  const damageCounts: Record<string, number> = {};
  const policyCounts: Record<string, number> = {};

  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
  }
  for (const p of policyItems) {
    policyCounts[p.type] = (policyCounts[p.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(damageCounts)) {
    const available = policyCounts[type] || 0;
    if (count > available) {
      throw new Error(`More ${type} damages claimed than insured`);
    }
  }

  let totalPayout = 0;

  for (const damage of damages) {
    const policyItem = policyItems.find((p) => p.type === damage.itemType);
    if (!policyItem) continue;

    let rate = 1;
    const enchantment = policyItem.enchantment || 0;
    const material = policyItem.material || "";

    if (enchantment >= 8) {
      rate = 0.5;
    }
    if (material === "dragon") {
      rate = 1;
    }
    if (enchantment >= 8 && material === "dragon") {
      rate = 0.5;
    }

    let reimbursed = damage.amount * rate;
    const deductible = 100;
    const payout = Math.max(0, reimbursed - deductible);
    totalPayout += payout;
  }

  if (totalPayout > remainingCap) {
    totalPayout = remainingCap;
  }

  const newRemainingCap = remainingCap - totalPayout;

  return {
    payout: Math.floor(totalPayout),
    remainingCap: Math.floor(newRemainingCap),
  };
}