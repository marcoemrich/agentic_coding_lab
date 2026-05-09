const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

export const quote = (customer: unknown, items: unknown[]): number => {
  const { totalBase, totalItemPremium, runeCount } = items.reduce(
    (acc, rawItem) => {
      const item = rawItem as { type: string; cursed: boolean; enchantment: number };
      const base = BASE_PREMIUMS[item.type];
      const cursedSurcharge = item.cursed ? base * 0.5 : 0;
      const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * 0.3 : 0;
      return {
        totalBase: acc.totalBase + base,
        totalItemPremium: acc.totalItemPremium + base + cursedSurcharge + enchantmentSurcharge,
        runeCount: acc.runeCount + (item.type === "rune" ? 1 : 0),
      };
    },
    { totalBase: 0, totalItemPremium: 0, runeCount: 0 }
  );
  const blockDiscount = runeCount === 3 ? 15 : 0;
  const adjustedBase = totalBase - blockDiscount;
  const adjustedItemPremium = totalItemPremium - blockDiscount;
  const { yearsWithMHPCO, contractCount } = customer as { yearsWithMHPCO: number; contractCount: number };
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? adjustedBase * 0.2 : 0;
  const followUpDiscount = contractCount >= 1 ? adjustedBase * 0.15 : 0;
  return Math.ceil(adjustedItemPremium + adjustedBase * FIRST_INSURANCE_SURCHARGE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

export const createPolicy = (rawItems: unknown[]): unknown => {
  const items = rawItems as { type: string; enchantment?: number }[];
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * 2 };
};

export const claim = (policy: unknown, incident: unknown): unknown => {
  const typedPolicy = policy as { items: { type: string; enchantment?: number }[]; remainingCap: number };
  const { items } = typedPolicy;
  const { damages } = incident as { damages: { itemType: string; amount: number }[] };
  const rawPayout = damages.reduce((sum, damage) => {
    const item = items.find(i => i.type === damage.itemType);
    const reimbursable = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? damage.amount * REDUCED_REIMBURSEMENT_RATE : damage.amount;
    return sum + reimbursable - DEDUCTIBLE;
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, typedPolicy.remainingCap));
  typedPolicy.remainingCap -= payout;
  return { payout, remainingCap: typedPolicy.remainingCap };
};
