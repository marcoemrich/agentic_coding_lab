const DEDUCTIBLE_PER_DAMAGE_EVENT = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const HEAVILY_ENCHANTED_LEVEL = 8;
const HEAVILY_ENCHANTED_REIMBURSEMENT_RATE = 0.5;

export interface InsuredItem {
  type: string;
  insuranceValue: number;
  material?: string;
  enchantment?: number;
}

export interface Policy {
  items: InsuredItem[];
  insuranceSum: number;
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export function createPolicy(items: InsuredItem[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + item.insuranceValue,
    0
  );
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM,
  };
}

export function processClaim(
  policy: Policy,
  damages: Damage[]
): { payout: number; remainingCap: number } {
  const insured = [...policy.items];
  const claims = damages.map((damage) => ({
    damage: requireValidAmount(damage),
    item: takeInsuredItem(insured, damage),
  }));
  const reimbursed = claims.reduce(
    (sum, claim) => sum + reimbursedAmount(claim.item, claim.damage),
    0
  );
  const fractionalPayout = Math.min(reimbursed, policy.remainingCap);
  const payout = Math.floor(fractionalPayout);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function takeInsuredItem(insured: InsuredItem[], damage: Damage): InsuredItem {
  const index = insured.findIndex((i) => i.type === damage.itemType);
  if (index < 0) {
    throw new Error(
      `item type not insured on this policy: ${damage.itemType}`
    );
  }
  return insured.splice(index, 1)[0];
}

function requireValidAmount(damage: Damage): Damage {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  return damage;
}

function insuredItemFor(policy: Policy, damage: Damage): InsuredItem {
  const item = policy.items.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(
      `item type not insured on this policy: ${damage.itemType}`
    );
  }
  return item;
}

function reimbursedAmount(item: InsuredItem, damage: Damage): number {
  return (
    damage.amount * reimbursementRateOf(item) - DEDUCTIBLE_PER_DAMAGE_EVENT
  );
}

function reimbursementRateOf(item: InsuredItem): number {
  return isHeavilyEnchanted(item)
    ? HEAVILY_ENCHANTED_REIMBURSEMENT_RATE
    : 1;
}

function isHeavilyEnchanted(item: InsuredItem): boolean {
  return (item.enchantment ?? 0) >= HEAVILY_ENCHANTED_LEVEL;
}
