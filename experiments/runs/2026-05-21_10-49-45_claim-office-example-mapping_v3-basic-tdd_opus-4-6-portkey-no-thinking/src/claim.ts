import { isKnownItem } from './pricing.js';
import type { Item } from './quote.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  totalPaidOut: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function findMatchingItem(policyItems: Item[], itemType: string, usedIndices: Set<number>): Item {
  for (let i = 0; i < policyItems.length; i++) {
    if (!usedIndices.has(i) && policyItems[i].type === itemType) {
      usedIndices.add(i);
      return policyItems[i];
    }
  }
  throw new Error(`Damage to '${itemType}' not covered by policy`);
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  // Validate all damages first
  for (const d of damages) {
    if (!isKnownItem(d.itemType)) {
      throw new Error(`Unknown item type in damage: ${d.itemType}`);
    }
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  }

  // Match damages to policy items
  const usedIndices = new Set<number>();
  const matchedItems: Item[] = [];
  for (const d of damages) {
    matchedItems.push(findMatchingItem(policy.items, d.itemType, usedIndices));
  }

  // Calculate raw payout for each damage
  let totalRawPayout = 0;
  for (let i = 0; i < damages.length; i++) {
    const damage = damages[i];
    const item = matchedItems[i];

    let reimbursement = damage.amount;

    // High enchantment (≥8): 50% reimbursement
    const enchantment = item.enchantment ?? 0;
    if (enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
    }
    // Dragon material: full reimbursement (but high enchantment takes precedence if both apply)
    // "both clauses apply; the 50% rule wins" — so high enchantment already handled above

    // Apply deductible
    reimbursement = reimbursement - DEDUCTIBLE;
    if (reimbursement < 0) reimbursement = 0;

    totalRawPayout += reimbursement;
  }

  // Round down (in MHPCO's favor for payouts)
  let payout = Math.floor(totalRawPayout);

  // Apply cap
  const remainingCap = policy.cap - policy.totalPaidOut;
  if (payout > remainingCap) {
    payout = remainingCap;
  }

  return {
    payout,
    remainingCap: remainingCap - payout,
  };
}
