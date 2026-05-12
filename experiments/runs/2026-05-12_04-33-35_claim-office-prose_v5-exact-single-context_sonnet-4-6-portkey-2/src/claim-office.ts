export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

export type QuoteOptions = {
  isFirstInsurance: boolean;
};

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, rune: 25 };
const BUNDLE_BASE_PREMIUM = 60; // 3 alike components at special rate
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

export const quote = (
  customer: Customer,
  items: Item[],
  options: QuoteOptions
): number => {
  const isBundle = items.length === 3 &&
    items.every(item => item.type === items[0].type) &&
    BASE_PREMIUMS[items[0].type] === 25;
  const totalBase = isBundle ? BUNDLE_BASE_PREMIUM : items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  const multipliers = [
    options.isFirstInsurance ? 110 : 85,
    items.some(item => item.cursed) ? 150 : 100,
    items.some(item => item.enchantment >= 5) ? 130 : 100,
    customer.yearsWithMHPCO >= 2 ? 80 : 100,
  ];
  const rawPremium = multipliers.reduce((p, m) => p * m, totalBase);
  return Math.ceil(rawPremium / 100 ** multipliers.length) + PROCESSING_FEE;
};

export type Policy = {
  insuranceSum: number;
  remainingCap: number;
};

export type Damage = {
  itemType: string;
  amount: number;
  enchantment?: number;
  material?: string;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export const claim = (
  policy: Policy,
  incident: Incident
): { payout: number; remainingCap: number } => {
  const totalDamage = incident.damages.reduce((sum, damage) => {
    const effective = damage.material === "dragon" ? damage.amount
      : (damage.enchantment ?? 0) >= 8 ? damage.amount * 0.5
      : damage.amount;
    return sum + effective;
  }, 0);
  const payout = Math.min(totalDamage - DEDUCTIBLE, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
};
