import { Damage, Incident, Item, ClaimResult } from "./types.js";
import { assertKnownType, insuranceValueOf } from "./catalogue.js";

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items: [...items], insuranceSum, cap, remainingCap: cap };
}

function reimbursementFor(item: Item, damage: number): number {
  // The 50% high-enchantment rule wins over dragon-material full reimbursement.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  // Dragon material and the default both reimburse the full damage; the
  // deductible (applied by the caller) is the only reduction.
  return damage;
}

function payoutFor(item: Item, damage: number): number {
  return Math.max(0, reimbursementFor(item, damage) - DEDUCTIBLE);
}

// Pair each damage to a distinct insured item of the matching type. Throws if
// any damage cannot be matched (extra entries of a type, unknown type, etc.).
function matchDamages(policy: Policy, damages: Damage[]): { item: Item; damage: Damage }[] {
  const used = new Set<number>();
  const pairs: { item: Item; damage: Damage }[] = [];
  for (const damage of damages) {
    let matched: Item | undefined;
    for (let i = 0; i < policy.items.length; i++) {
      if (!used.has(i) && policy.items[i].type === damage.itemType) {
        used.add(i);
        matched = policy.items[i];
        break;
      }
    }
    if (!matched) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
    pairs.push({ item: matched, damage });
  }
  return pairs;
}

function validateDamages(damages: Damage[]): void {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    assertKnownType(d.itemType);
  }
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  validateDamages(incident.damages);
  const pairs = matchDamages(policy, incident.damages);

  const totalPayoutBeforeRounding = pairs.reduce(
    (sum, { item, damage }) => sum + payoutFor(item, damage.amount),
    0
  );

  // Payouts round down — in MHPCO's favor.
  const desired = Math.floor(totalPayoutBeforeRounding);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
