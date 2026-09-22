import { insuranceValue, type Item } from './premium';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF = 0.5;

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_FACTOR };
}

// Dragon material is reimbursed in full, which is the default; only the
// high-enchantment clause reduces the covered amount.
function reimbursement(item: Item, amount: number): number {
  const covered =
    (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD ? amount * HALF : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

function matchDamagedItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
  const damagedItems = matchDamagedItems(policy, damages);
  const desired = damages.reduce(
    (sum, damage, index) => sum + reimbursement(damagedItems[index], damage.amount),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
