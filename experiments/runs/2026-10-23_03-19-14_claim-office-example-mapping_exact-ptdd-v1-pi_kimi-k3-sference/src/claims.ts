// MHPCO claim policy: insurance values, deductible, reimbursement clauses, and payout cap.
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const DRAGON_MATERIAL = "dragon";
const FULL = 1;
const HALF = 0.5;

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
}

export function insuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

export function policyCap(items: InsuredItem[]): number {
  return insuranceSum(items) * CAP_MULTIPLE;
}

function reimbursementRate(item: InsuredItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL) {
    return HALF;
  }
  if (item.material === DRAGON_MATERIAL) {
    return FULL;
  }
  return FULL;
}

function validateClaim(items: InsuredItem[], damages: { itemType: string; amount: number }[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
  const damagedTypes = [...new Set(damages.map((damage) => damage.itemType))];
  for (const type of damagedTypes) {
    const insuredCount = items.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (insuredCount === 0) {
      throw new Error(`damaged item not covered by policy: ${type}`);
    }
    if (damageCount > insuredCount) {
      throw new Error(`more damages than insured items of type: ${type}`);
    }
  }
}

export function claimPayout(
  items: InsuredItem[],
  damages: { itemType: string; amount: number }[],
): number {
  validateClaim(items, damages);
  return damages.reduce((sum, damage) => {
    const item = items.find((insured) => insured.type === damage.itemType) as InsuredItem;
    return sum + Math.max(damage.amount * reimbursementRate(item) - DEDUCTIBLE, 0);
  }, 0);
}
