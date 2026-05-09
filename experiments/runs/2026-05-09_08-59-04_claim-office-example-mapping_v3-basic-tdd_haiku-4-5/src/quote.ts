import { getItemSpec } from './items';

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

function calculateComponentBlocks(items: Item[]): Record<string, number> {
  // Group items by type and count blocks of 3 alike components
  const componentTypes = ['rune', 'moonstone'];
  const groups: Record<string, Item[]> = {};
  const nonComponents: Item[] = [];

  for (const item of items) {
    if (componentTypes.includes(item.type)) {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    } else {
      nonComponents.push(item);
    }
  }

  // Calculate base premium for non-components
  let totalBasePremium = 0;
  const itemBreakdown: Record<string, number> = {};

  for (const item of nonComponents) {
    const spec = getItemSpec(item.type);
    itemBreakdown[item.type] = (itemBreakdown[item.type] || 0) + spec.basePremium;
    totalBasePremium += spec.basePremium;
  }

  // Process components with block discount
  for (const [type, typeItems] of Object.entries(groups)) {
    const spec = getItemSpec(type);
    const count = typeItems.length;
    const numBlocks = Math.floor(count / 3);
    const remainder = count % 3;

    // Add block premiums
    for (let i = 0; i < numBlocks; i++) {
      totalBasePremium += 60; // Block of 3 components
    }

    // Add remainder as individual items
    for (let i = 0; i < remainder; i++) {
      totalBasePremium += spec.basePremium;
    }

    itemBreakdown[type] = numBlocks * 60 + remainder * spec.basePremium;
  }

  return itemBreakdown;
}

function calculateItemModifiers(items: Item[]): number {
  let modifierTotal = 0;

  for (const item of items) {
    const spec = getItemSpec(item.type);

    // Cursed surcharge: 50% of base premium
    if (item.cursed) {
      modifierTotal += spec.basePremium * 0.5;
    }

    // High enchantment surcharge: 30% of base premium
    const enchantment = item.enchantment || 0;
    if (enchantment >= 5) {
      modifierTotal += spec.basePremium * 0.3;
    }
  }

  return modifierTotal;
}

export function calculateQuote(
  items: Item[],
  customer: Customer,
  isFirstQuote: boolean
): number {
  // Calculate base premiums
  let policyBasePremium = 0;

  if (items.length === 0) {
    // Empty item list - only processing fee
    return 5;
  }

  // For non-component items, sum their base premiums
  const componentTypes = ['rune', 'moonstone'];
  const nonComponentItems = items.filter((item) => !componentTypes.includes(item.type));
  const componentItems = items.filter((item) => componentTypes.includes(item.type));

  for (const item of nonComponentItems) {
    const spec = getItemSpec(item.type);
    policyBasePremium += spec.basePremium;
  }

  // For components, calculate policy base as if no blocks (raw sum)
  for (const item of componentItems) {
    const spec = getItemSpec(item.type);
    policyBasePremium += spec.basePremium;
  }

  // Calculate item-specific modifiers
  let itemModifiers = 0;
  const componentTypes2 = ['rune', 'moonstone'];

  for (const item of items) {
    if (!componentTypes2.includes(item.type)) {
      const spec = getItemSpec(item.type);

      // Cursed surcharge: 50% of base premium
      if (item.cursed) {
        itemModifiers += spec.basePremium * 0.5;
      }

      // High enchantment surcharge: 30% of base premium
      const enchantment = item.enchantment || 0;
      if (enchantment >= 5) {
        itemModifiers += spec.basePremium * 0.3;
      }
    }
  }

  // Calculate block discount adjustment (base premium diff due to blocks)
  let blockAdjustment = 0;
  const groups: Record<string, Item[]> = {};
  for (const item of componentItems) {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }
    groups[item.type].push(item);
  }

  for (const [type, typeItems] of Object.entries(groups)) {
    const spec = getItemSpec(type);
    const count = typeItems.length;
    const numBlocks = Math.floor(count / 3);
    const remainder = count % 3;

    // Block premium is 60, vs normal 25*3 = 75
    blockAdjustment += numBlocks * (60 - 75);
  }

  // Apply policy-wide modifiers to policy base premium
  let policyModifiers = 0;

  // Loyalty discount: 20% of policy base
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBasePremium * 0.2;
  }

  // First insurance surcharge or follow-up discount
  if (isFirstQuote) {
    policyModifiers += policyBasePremium * 0.1; // 10% first insurance
  } else {
    policyModifiers -= policyBasePremium * 0.15; // 15% follow-up discount
  }

  // Calculate total
  const premiumBeforeFee =
    policyBasePremium + itemModifiers + blockAdjustment + policyModifiers;
  const total = premiumBeforeFee + 5; // Processing fee

  // Round up for premium
  return Math.ceil(total);
}
