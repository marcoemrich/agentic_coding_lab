export type Customer = { yearsWithMHPCO: number };
export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type QuoteInput = { items: Item[] };
export type QuoteResult = { premium: number };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// Apply per-item modifiers to an item's base premium.
// Returns the per-item premium as integer-hundredths (so x100 of G) to keep precision.
const itemPremiumHundredths = (item: Item, base: number): number => {
  let hundredths = base * 100;
  if (item.cursed) {
    hundredths = (hundredths * 150) / 100; // +50% cursed surcharge
  }
  if ((item.enchantment ?? 0) >= 5) {
    hundredths = (hundredths * 130) / 100; // +30% high-enchantment surcharge
  }
  return hundredths;
};

const itemsBasePremiumHundredths = (items: Item[]): number => {
  const components = items.filter((i) => COMPONENT_TYPES.has(i.type));
  const mains = items.filter((i) => !COMPONENT_TYPES.has(i.type));

  let total = 0;
  for (const m of mains) {
    total += itemPremiumHundredths(m, BASE_PREMIUM[m.type]);
  }

  // Group components by type to form bundles of 3 alike
  const byType = new Map<string, Item[]>();
  for (const c of components) {
    if (!byType.has(c.type)) byType.set(c.type, []);
    byType.get(c.type)!.push(c);
  }
  for (const [, comps] of byType) {
    // Form bundles of 3. A bundle takes 3 components, charged at 60 G base.
    // Distribute per-item modifiers proportionally? Spec only says base price; modifiers
    // apply to items. For simplicity: any cursed item in bundle multiplies the bundle.
    // For now, only handle the simple case: no per-component modifiers.
    while (comps.length >= 3) {
      const triple = comps.splice(0, 3);
      // Sum each item's modifier factor on its share of the 60.
      // Simpler: apply each item's modifier to 20 (= 60/3) and sum.
      for (const c of triple) {
        total += itemPremiumHundredths(c, 20);
      }
    }
    for (const c of comps) {
      total += itemPremiumHundredths(c, BASE_PREMIUM[c.type]);
    }
  }
  return total;
};

export const quote = (
  customer: Customer,
  input: QuoteInput,
  contractIndex: number,
): QuoteResult => {
  let hundredths = itemsBasePremiumHundredths(input.items);
  if (contractIndex === 0) {
    // First-insurance surcharge of 10% on the customer's very first contract
    hundredths = (hundredths * 110) / 100;
  } else {
    // Repeat-contract discount of 15% on every contract after the first
    hundredths = (hundredths * 85) / 100;
  }
  // Loyalty discount of 20% for customers with >= 2 years
  if (customer.yearsWithMHPCO >= 2) {
    hundredths = (hundredths * 80) / 100;
  }
  // Round up to whole G in MHPCO's favor, then add 5 G fee.
  const premium = Math.ceil(hundredths / 100) + 5;
  return { premium };
};

export type Damage = { itemType: string; amount: number };
export type Incident = { cause?: string; damages: Damage[] };
export type ClaimInput = { policy: number; incident: Incident };
export type ClaimResult = { payout: number; remainingCap: number };

const reimbursementForDamage = (item: Item | undefined, amount: number): number => {
  if (item && item.material === "dragon") return amount;
  if (item && (item.enchantment ?? 0) >= 8) return Math.floor(amount * 0.5);
  return amount;
};

const findItem = (items: Item[], type: string): Item | undefined => {
  return items.find((i) => i.type === type);
};

export const claim = (
  policy: { items: Item[]; cap: number; remainingCap: number },
  incident: Incident,
): ClaimResult => {
  const DEDUCTIBLE = 100;
  let reimbursable = 0;
  for (const d of incident.damages) {
    const item = findItem(policy.items, d.itemType);
    reimbursable += reimbursementForDamage(item, d.amount);
  }
  const uncapped = Math.max(0, reimbursable - DEDUCTIBLE);
  const payout = Math.min(uncapped, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
