export interface InsuredItem {
  type: string;
  insuranceValue: number;
  enchantment: number;
  material: string;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

function isHighEnchanted(item: InsuredItem): boolean {
  return item.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;
}

function reimbursementFor(item: InsuredItem, amount: number): number {
  const rate = isHighEnchanted(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
  return rate * amount;
}

export function createPolicy(items: InsuredItem[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + item.insuranceValue, 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function assertNonNegativeDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function assertCoverage(items: InsuredItem[], damages: Damage[]): void {
  const insuredByType = new Map<string, number>();
  for (const item of items) {
    insuredByType.set(item.type, (insuredByType.get(item.type) ?? 0) + 1);
  }
  for (const damage of damages) {
    const available = insuredByType.get(damage.itemType) ?? 0;
    if (available <= 0) {
      throw new Error(`Item type not insured: ${damage.itemType}`);
    }
    insuredByType.set(damage.itemType, available - 1);
  }
}

export function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  assertNonNegativeDamages(damages);
  assertCoverage(policy.items, damages);
  let gross = 0;
  for (const damage of damages) {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    gross += reimbursementFor(item as InsuredItem, damage.amount) - DEDUCTIBLE;
  }
  const desired = Math.floor(gross);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
