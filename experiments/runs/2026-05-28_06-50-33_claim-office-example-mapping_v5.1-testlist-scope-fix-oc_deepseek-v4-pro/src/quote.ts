const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export function calculateBasePremium(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  let total = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (count === 3 && (type === "rune" || type === "moonstone")) {
      total += 60;
    } else {
      total += count * BASE_PREMIUMS[type];
    }
  }
  return total;
}

function getItemBasePremium(type: string): number {
  return BASE_PREMIUMS[type];
}

interface Customer {
  yearsWithMHPCO: number;
}

export function calculatePremium(
  items: Item[],
  customer: Customer,
  contractNumber: number,
): number {
  const policyBasePremium = calculateBasePremium(items);

  const itemModifiers = items.reduce((sum, item) => {
    const base = getItemBasePremium(item.type);
    let mod = 0;
    if (item.cursed) mod += base * 0.5;
    if ((item.enchantment || 0) >= 5) mod += base * 0.3;
    return sum + mod;
  }, 0);

  let policyModRate = 0.1;
  if (customer.yearsWithMHPCO >= 2) policyModRate -= 0.2;
  if (contractNumber > 1) policyModRate -= 0.15;

  const policyModifiers = policyBasePremium * policyModRate;
  return Math.ceil(policyBasePremium + itemModifiers + policyModifiers + 5);
}