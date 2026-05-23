import { Damage, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_FACTOR = 0.5;
const DRAGON_MATERIAL = "dragon";

function tally(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of types) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

function validateDamages(policyItems: Item[], damages: Damage[]): void {
  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
  }

  const policyCounts = tally(policyItems.map((i) => i.type));
  const damageCounts = tally(damages.map((d) => d.itemType));

  for (const [type, count] of damageCounts) {
    const insured = policyCounts.get(type) ?? 0;
    if (insured === 0) {
      throw new Error(`Damage references item type not in policy: ${type}`);
    }
    if (count > insured) {
      throw new Error(
        `Damage references more items of type ${type} than policy covers`,
      );
    }
  }
}

function reimbursableAmount(item: Item, damageAmount: number): number {
  const highEnch =
    item.enchantment !== undefined &&
    item.enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  if (highEnch) return damageAmount * HIGH_ENCHANTMENT_PAYOUT_FACTOR;
  if (item.material === DRAGON_MATERIAL) return damageAmount;
  return damageAmount;
}

export function processClaim(
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  validateDamages(policy.items, damages);

  const itemsByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = itemsByType.get(item.type) ?? [];
    list.push(item);
    itemsByType.set(item.type, list);
  }

  const cursor = new Map<string, number>();
  let totalPayout = 0;

  for (const dmg of damages) {
    const items = itemsByType.get(dmg.itemType)!;
    const idx = cursor.get(dmg.itemType) ?? 0;
    cursor.set(dmg.itemType, idx + 1);
    const item = items[idx];

    const reimbursable = reimbursableAmount(item, dmg.amount);
    const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }

  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);

  return {
    payout: finalPayout,
    remainingCap: policy.remainingCap - finalPayout,
  };
}
