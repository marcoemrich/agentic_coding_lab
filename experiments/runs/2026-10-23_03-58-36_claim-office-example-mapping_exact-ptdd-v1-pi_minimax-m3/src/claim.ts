// Claim processing: validates damages, computes per-damage reimbursement
// (with the high-enchantment / dragon-material clauses), subtracts the
// per-event deductible, applies the policy cap, and rounds down.

import type { DamageEntry, ItemType, Policy, QuoteItem } from "./domain.js";
import { DomainError } from "./domain.js";
import {
  DEDUCTIBLE_PER_EVENT,
  HIGH_ENCHANTMENT_PAYOUT_RATE,
  HIGH_ENCHANTMENT_PAYOUT_THRESHOLD,
} from "./domain.js";
import { isComponentType, isMainItemType } from "./policy.js";

function isKnownItemType(type: string): type is ItemType {
  return isMainItemType(type as ItemType) || isComponentType(type as ItemType);
}

function validateDamages(damages: DamageEntry[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new DomainError(
        `Damage amount must be non-negative, got ${damage.amount}`,
      );
    }
    if (!isKnownItemType(damage.itemType)) {
      throw new DomainError(`Unknown item type: ${damage.itemType}`);
    }
  }
}

function countPolicyItems(items: readonly QuoteItem[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function countDamagesByType(damages: readonly DamageEntry[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
}

function checkDamagesAgainstPolicy(
  policy: Policy,
  damages: DamageEntry[],
): void {
  const policyCounts = countPolicyItems(policy.items);
  const damageCounts = countDamagesByType(damages);
  for (const [type, dmgCount] of damageCounts) {
    const polCount = policyCounts.get(type) ?? 0;
    if (dmgCount > polCount) {
      throw new DomainError(
        `More ${type} damages (${dmgCount}) than insured items (${polCount})`,
      );
    }
  }
}

function reimbursementRate(item: QuoteItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return 1;
}

function computeRawPayout(policy: Policy, damages: DamageEntry[]): number {
  const remaining = [...policy.items];
  let raw = 0;
  for (const damage of damages) {
    const idx = remaining.findIndex((i) => i.type === damage.itemType);
    if (idx === -1) {
      throw new DomainError(`No matching ${damage.itemType} remaining in policy`);
    }
    const [item] = remaining.splice(idx, 1);
    raw += damage.amount * reimbursementRate(item) - DEDUCTIBLE_PER_EVENT;
  }
  return raw;
}

export function calculateClaimPayout(
  policy: Policy,
  damages: DamageEntry[],
): { payout: number; remainingCap: number } {
  validateDamages(damages);
  checkDamagesAgainstPolicy(policy, damages);
  const rawPayout = computeRawPayout(policy, damages);
  const capped = Math.min(rawPayout, policy.remainingCap);
  const payout = Math.floor(capped);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
}
