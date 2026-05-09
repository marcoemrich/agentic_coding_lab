import {
  ComponentItem,
  COMPONENT_INSURANCE_VALUE,
  Damage,
  Incident,
  Item,
  ItemType,
  MAIN_ITEM_INSURANCE_VALUE,
  MainItem,
  isComponent,
  isMainItem,
} from './types.js';

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export interface ClaimOutput {
  payout: number;
  remainingCap: number;
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  if (isMainItem(item)) return MAIN_ITEM_INSURANCE_VALUE[item.type];
  throw new Error(`Unknown item type: ${(item as any).type}`);
}

export function createPolicy(items: Item[]): Policy {
  // Validate
  for (const item of items) {
    if (!isComponent(item) && !isMainItem(item)) {
      throw new Error(`Unknown item type: ${(item as any).type}`);
    }
  }
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  const cap = insuranceSum * 2;
  return {
    items,
    insuranceSum,
    cap,
    remainingCap: cap,
  };
}

/**
 * Compute the payout for a single damage entry, given the matching insured item.
 * Returns the unrounded payout (deductible already applied) so callers can sum
 * fractional amounts and round at the end.
 */
function payoutForDamage(item: Item, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
  }
  let reimbursable = damage.amount;
  if (isMainItem(item)) {
    // The 50% high-enchantment clause takes precedence over dragon material
    // when both apply (per prompt example).
    if ((item.enchantment ?? 0) >= 8) {
      reimbursable = damage.amount * 0.5;
    } else if (item.material === 'dragon') {
      reimbursable = damage.amount;
    }
  }
  // Components: no special clauses (no enchantment / material on components).
  const afterDeductible = reimbursable - 100;
  return Math.max(0, afterDeductible);
}

/**
 * Match each damage entry to a specific insured item.
 * Each insured item can be matched at most once per claim. If the damages
 * contain more entries of a given type than insured, throw.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const usedIndices = new Set<number>();
  const matched: Item[] = [];
  for (const damage of damages) {
    let foundIndex = -1;
    for (let i = 0; i < policy.items.length; i++) {
      if (usedIndices.has(i)) continue;
      if (policy.items[i].type === damage.itemType) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex === -1) {
      throw new Error(
        `Damage references item not in policy or no remaining insured item of type "${damage.itemType}"`,
      );
    }
    usedIndices.add(foundIndex);
    matched.push(policy.items[foundIndex]);
  }
  return matched;
}

export function processClaim(policy: Policy, incident: Incident): ClaimOutput {
  // Pre-validate all damage amounts
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
  const matched = matchDamagesToItems(policy, incident.damages);

  // Sum unrounded per-damage payouts
  let total = 0;
  for (let i = 0; i < incident.damages.length; i++) {
    total += payoutForDamage(matched[i], incident.damages[i]);
  }

  // Apply remaining cap
  const desired = total;
  const cappedRaw = Math.min(desired, policy.remainingCap);
  // Round in MHPCO's favor (payout → down)
  const rounded = Math.floor(cappedRaw + 1e-9);
  policy.remainingCap = policy.remainingCap - rounded;
  if (policy.remainingCap < 0) policy.remainingCap = 0;
  return {
    payout: rounded,
    remainingCap: policy.remainingCap,
  };
}
