import {
  Customer,
  Item,
  MAIN_ITEMS,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  isMainItemType,
  isComponentType,
  isKnownItemType,
} from './types.js';

function isComponent(item: Item): boolean {
  return isComponentType(item.type);
}

/**
 * Compute the base premium for an item (no surcharges/discounts).
 * For components, this function is not used directly; components are
 * grouped in computeComponentBase.
 */
function mainItemBase(item: Item): number {
  if (!isMainItemType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return MAIN_ITEMS[item.type].basePremium;
}

/**
 * For components: group by type. Each group of N components costs:
 * - If N == 3: COMPONENT_BLOCK_PREMIUM (60 G)
 * - Else: N * COMPONENT_BASE_PREMIUM
 *
 * Returns the total component base premium.
 */
function computeComponentBase(components: Item[]): number {
  const byType = new Map<string, number>();
  for (const c of components) {
    byType.set(c.type, (byType.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of byType.values()) {
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

/**
 * Compute the premium for a quote.
 * priorContracts: how many quote contracts the customer has had before this one.
 */
export function computePremium(
  customer: Customer,
  items: Item[],
  priorContracts: number
): number {
  // Validate all items first
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Separate main items from components
  const mainItems = items.filter((i) => isMainItemType(i.type));
  const components = items.filter((i) => isComponent(i));

  // Compute item totals (item base + item-specific modifiers like cursed, high ench)
  let itemTotals = 0;
  let policyBase = 0;

  for (const m of mainItems) {
    const base = mainItemBase(m);
    policyBase += base;
    let surcharge = 0;
    if (m.cursed) {
      surcharge += base * 0.5;
    }
    if ((m.enchantment ?? 0) >= 5) {
      surcharge += base * 0.3;
    }
    itemTotals += base + surcharge;
  }

  // Components: block discount only on base premium; per the spec,
  // components don't have material/enchantment/cursed surcharges
  // (the example "standard reimbursement" notes: "runes have no enchantment level or material").
  const componentBase = computeComponentBase(components);
  policyBase += componentBase;
  itemTotals += componentBase;

  // Policy-wide modifiers, all expressed as a fraction of policyBase
  let policyModifierFraction = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifierFraction -= 0.2; // loyalty
  }
  // First insurance: each item in a quote is treated as first insurance,
  // regardless of customer history. Applies to policy base.
  policyModifierFraction += 0.1;
  if (priorContracts >= 1) {
    policyModifierFraction -= 0.15; // follow-up contract
  }

  const beforeFee = itemTotals + policyBase * policyModifierFraction;
  const total = beforeFee + 5; // processing fee
  // Round up in MHPCO's favor
  return Math.ceil(total);
}
