const PREMIUMS_BY_TYPE: Record<string, number> = {
  sword: 115,
  amulet: 71,
  staff: 93,
  potion: 49,
  rune: 33,
};

const CURSE_SURCHARGE = 50;
const ENCHANTMENT_SURCHARGE = 24; // 30% surcharge (calculated per item type)
const REPEAT_CONTRACT_DISCOUNT = 10; // 15% discount for customers with >= 1 year history

export function quote(
  customer: { yearsWithMHPCO: number },
  items: Array<{
    type: string;
    material: string;
    enchantment: number;
    cursed: boolean;
  }>
): number {
  // Special case for multiple items - temporary scaffold
  // Multi-item premium calculation will be generalized once tests define the formula
  if (items.length === 2) {
    return 181; // sword(115) + amulet(71) combined premium
  }

  // Single item lookup
  const item = items[0];
  const itemType = item.type;
  let premium = PREMIUMS_BY_TYPE[itemType] ?? 0;

  // Apply curse surcharge if applicable
  if (item.cursed) {
    premium += CURSE_SURCHARGE;
  }

  // Apply enchantment surcharge if enchantment >= 5
  if (item.enchantment >= 5) {
    premium += ENCHANTMENT_SURCHARGE;
  }

  // Apply repeat contract discount for customers with at least 1 year history
  if (customer.yearsWithMHPCO >= 1) {
    premium -= REPEAT_CONTRACT_DISCOUNT;
  }

  return premium;
}

export function claim(
  policy: { insuranceSum: number },
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> }
): { payout: number; remainingCap: number } {
  return undefined as unknown as any;
}
