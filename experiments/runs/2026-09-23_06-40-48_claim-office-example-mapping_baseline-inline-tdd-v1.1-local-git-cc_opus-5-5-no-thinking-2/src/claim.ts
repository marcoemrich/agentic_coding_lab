import { Item, ValidationError, assertKnownType, insuranceValue } from './catalog';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;
const EPSILON = 1e-9;

export class Policy {
  remainingCap: number;

  constructor(readonly items: Item[]) {
    const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
    this.remainingCap = insuranceSum * CAP_FACTOR;
  }
}

function reimbursableAmount(item: Item, amount: number): number {
  // The high-enchantment clause wins over dragon material (which is full reimbursement anyway).
  const reimbursed = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? amount * HIGH_ENCHANTMENT_RATE : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function matchDamagedItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    assertKnownType(damage.itemType);
    if (!Number.isInteger(damage.amount) || damage.amount < 0) {
      throw new ValidationError(`Invalid damage amount: ${String(damage.amount)}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new ValidationError(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  if (!Array.isArray(damages)) throw new ValidationError('damages must be an array');
  const items = matchDamagedItems(policy, damages);
  const requested = items.reduce((sum, item, i) => sum + reimbursableAmount(item, damages[i].amount), 0);
  const payout = Math.min(Math.floor(requested + EPSILON), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
