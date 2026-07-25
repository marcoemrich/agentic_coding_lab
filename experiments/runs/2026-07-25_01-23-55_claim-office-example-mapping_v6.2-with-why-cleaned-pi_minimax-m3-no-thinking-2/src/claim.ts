import type { QuoteItem } from "./quote.js";

export interface Policy {
  items: QuoteItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  premium: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimInput {
  policy: Policy;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursementRate(item: QuoteItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1.0;
}

function nextAvailableItem(policy: Policy, type: string, used: Record<string, number>): QuoteItem | null {
  const matching = policy.items.filter((i) => i.type === type);
  const consumed = used[type] ?? 0;
  if (consumed >= matching.length) {
    return null;
  }
  return matching[consumed];
}

export function claim(input: ClaimInput): ClaimResult {
  const { policy, damages } = input;
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
  let total = 0;
  const used: Record<string, number> = {};
  for (const damage of damages) {
    const item = nextAvailableItem(policy, damage.itemType, used);
    if (item === null) {
      throw new Error(`item not in policy: ${damage.itemType}`);
    }
    used[damage.itemType] = (used[damage.itemType] ?? 0) + 1;
    const rate = reimbursementRate(item);
    total += damage.amount * rate - DEDUCTIBLE;
  }
  const payout = Math.max(0, Math.min(total, policy.remainingCap));
  return {
    payout: Math.floor(payout),
    remainingCap: policy.remainingCap - Math.floor(payout),
  };
}
