import {
  Item,
  Incident,
  MAIN_ITEMS,
  COMPONENT_INSURANCE_VALUE,
  isMainItemType,
  isComponentType,
  isKnownItemType,
} from './types.js';

export interface Policy {
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  items: Item[];
}

function itemInsuranceValue(item: Item): number {
  if (isMainItemType(item.type)) {
    return MAIN_ITEMS[item.type].insuranceValue;
  }
  if (isComponentType(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  throw new Error(`Unknown item type: ${item.type}`);
}

export function createPolicy(items: Item[]): Policy {
  for (const it of items) {
    if (!isKnownItemType(it.type)) {
      throw new Error(`Unknown item type: ${it.type}`);
    }
  }
  const insuranceSum = items.reduce((acc, it) => acc + itemInsuranceValue(it), 0);
  const cap = insuranceSum * 2;
  return {
    insuranceSum,
    cap,
    remainingCap: cap,
    items: [...items],
  };
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

export function processClaim(
  policy: Policy,
  policyItems: Item[],
  incident: Incident
): ClaimOutcome {
  // Validate all damages first
  for (const d of incident.damages) {
    if (!isKnownItemType(d.itemType)) {
      throw new Error(`Unknown item type in damage: ${d.itemType}`);
    }
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  }

  // Count item types in policy
  const policyCounts = new Map<string, number>();
  for (const it of policyItems) {
    policyCounts.set(it.type, (policyCounts.get(it.type) ?? 0) + 1);
  }

  // Count damages per type, and make sure damages don't exceed policy items
  const damageCountsByType = new Map<string, number>();
  for (const d of incident.damages) {
    damageCountsByType.set(d.itemType, (damageCountsByType.get(d.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCountsByType) {
    const inPolicy = policyCounts.get(type) ?? 0;
    if (inPolicy === 0) {
      throw new Error(`Item type ${type} not insured by this policy`);
    }
    if (count > inPolicy) {
      throw new Error(
        `Damage count for ${type} (${count}) exceeds insured count (${inPolicy})`
      );
    }
  }

  // To map damages to specific items (for material/enchantment lookups),
  // we'll iterate damages in order and grab the next un-used item of that type
  // from the policy. (We assume the matching is by type only.)
  const itemsByType = new Map<string, Item[]>();
  for (const it of policyItems) {
    if (!itemsByType.has(it.type)) itemsByType.set(it.type, []);
    itemsByType.get(it.type)!.push(it);
  }
  // We'll use a cursor for each type
  const cursors = new Map<string, number>();

  let totalPayout = 0;
  for (const d of incident.damages) {
    const list = itemsByType.get(d.itemType);
    if (!list) {
      throw new Error(`Item type ${d.itemType} not insured`);
    }
    const idx = cursors.get(d.itemType) ?? 0;
    const item = list[idx];
    cursors.set(d.itemType, idx + 1);

    let reimbursed = d.amount;
    const isDragon = item.material === 'dragon';
    const enchantment = item.enchantment ?? 0;
    if (isDragon) {
      reimbursed = d.amount; // full
      if (enchantment >= 8) {
        // both clauses apply; 50% wins per spec
        reimbursed = d.amount * 0.5;
      }
    } else if (enchantment >= 8) {
      reimbursed = d.amount * 0.5;
    }

    const afterDeductible = reimbursed - 100;
    if (afterDeductible > 0) {
      totalPayout += afterDeductible;
    }
  }

  // Apply cap
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  // Round down (in MHPCO's favor)
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return {
    payout: finalPayout,
    remainingCap: policy.remainingCap,
  };
}
