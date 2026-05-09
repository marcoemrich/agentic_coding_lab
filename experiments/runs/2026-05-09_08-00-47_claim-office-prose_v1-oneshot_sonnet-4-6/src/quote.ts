import type { Item, Customer, Policy } from './types.js';

const MAIN_ITEM_PRICES: Record<string, { insured: number; premium: number }> = {
  sword: { insured: 1000, premium: 100 },
  amulet: { insured: 600, premium: 60 },
  staff: { insured: 800, premium: 80 },
  potion: { insured: 400, premium: 40 },
};

const COMPONENT_INSURED = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_TRIO_PREMIUM = 60;
const PROCESSING_FEE = 5;

// All surcharges/discounts are multiples of 1/20, so we use 20ths throughout.
// This keeps arithmetic exact (no floating-point surprises).
// Item multiplier: base 20/20 = 1, +10/20 cursed, +6/20 enchanted≥5
// Customer multiplier: +2/20 first, -3/20 repeat, -4/20 long-standing
// Total premium in G = ceil( (sumS * custMult) / (20 * 20) + PROCESSING_FEE )
// Multiplied through: ceil( (sumS * custMult + PROCESSING_FEE * 400) / 400 )

function isComponent(type: string): boolean {
  return !(type in MAIN_ITEM_PRICES);
}

function itemMult20(cursed: boolean, enchantment: number): number {
  let m = 20;
  if (cursed) m += 10; // +50%
  if (enchantment >= 5) m += 6; // +30%
  return m;
}

function customerMult20(contractNumber: number, yearsWithMHPCO: number): number {
  let m = 20;
  m += contractNumber === 1 ? 2 : -3; // +10% first, -15% repeat
  if (yearsWithMHPCO >= 2) m -= 4; // -20% loyalty
  return m;
}

function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    return sum + (isComponent(item.type) ? COMPONENT_INSURED : MAIN_ITEM_PRICES[item.type].insured);
  }, 0);
}

export function quote(
  items: Item[],
  customer: Customer,
  contractNumber: number,
): { premium: number; policy: Policy } {
  const mainItems = items.filter((item) => !isComponent(item.type));
  const componentItems = items.filter((item) => isComponent(item.type));

  // sumS accumulates base_premium_i * itemMult20_i (integer, denominator 20)
  let sumS = 0;

  for (const item of mainItems) {
    sumS += MAIN_ITEM_PRICES[item.type].premium * itemMult20(item.cursed, item.enchantment);
  }

  // Group components by type for trio pricing
  const componentGroups = new Map<string, Item[]>();
  for (const item of componentItems) {
    if (!componentGroups.has(item.type)) componentGroups.set(item.type, []);
    componentGroups.get(item.type)!.push(item);
  }

  for (const components of componentGroups.values()) {
    const trios = Math.floor(components.length / 3);
    const remainder = components.length % 3;

    for (let t = 0; t < trios; t++) {
      const slice = components.slice(t * 3, t * 3 + 3);
      const anyCursed = slice.some((c) => c.cursed);
      const maxEnch = Math.max(...slice.map((c) => c.enchantment));
      sumS += COMPONENT_TRIO_PREMIUM * itemMult20(anyCursed, maxEnch);
    }

    for (let s = 0; s < remainder; s++) {
      const item = components[trios * 3 + s];
      sumS += COMPONENT_PREMIUM * itemMult20(item.cursed, item.enchantment);
    }
  }

  const custMult = customerMult20(contractNumber, customer.yearsWithMHPCO);

  // premium = ceil( sumS/20 * custMult/20 + fee ) = ceil( (sumS*custMult + fee*400) / 400 )
  const numerator = sumS * custMult + PROCESSING_FEE * 400;
  const premium = Math.ceil(numerator / 400);

  const insuranceSum = calculateInsuranceSum(items);
  const policy: Policy = {
    items,
    insuranceSum,
    remainingCap: insuranceSum * 2,
  };

  return { premium, policy };
}
